import { prisma } from "./db";
import { LedgerEntryType, LedgerEntryDirection, LedgerEntryStatus, Prisma } from "@prisma/client";

// Re-export enums for easy access
export { LedgerEntryType, LedgerEntryDirection, LedgerEntryStatus };

export interface CreateLedgerEntryInput {
    type: LedgerEntryType;
    direction: LedgerEntryDirection;
    amount?: number;
    currency?: string;
    description: string;

    // Identifiers
    circleId?: string;
    userId?: string;
    adminId?: string;

    // Metadata
    metadata?: Record<string, any>;
}

/**
 * Core function to record an immutable ledger entry.
 * This is the ONLY way writes should happen to the ledger.
 */
export async function recordLedgerEntry(input: CreateLedgerEntryInput) {
    if (input.amount && input.amount < 0) {
        throw new Error("Ledger amounts must be positive. Use Direction (DEBIT/CREDIT) to sign.");
    }

    try {
        const entry = await prisma.userLedgerEntry.create({
            data: {
                type: input.type,
                direction: input.direction,
                amount: input.amount,
                currency: input.currency || 'USD',
                description: input.description,
                circleId: input.circleId,
                userId: input.userId,
                adminId: input.adminId,
                metadata: input.metadata || {},
                status: LedgerEntryStatus.POSTED
            }
        });

        console.log(`[Ledger] Recorded entry ${entry.id}: ${entry.type} (${entry.direction})`);

        // Trigger Async Score Recalculation (Fire & Forget to not block UI)
        if (input.userId) {
            import("./scoring").then(m => m.recalculateTrustScore(input.userId!));
        }

        return entry;
    } catch (error) {
        console.error("CRITICAL: Failed to record ledger entry", error);
        // We throw here because ledger failures should generally block the transaction
        throw error;
    }
}

/**
 * Fetch ledger history with standard filters
 */
export async function getLedgerHistory(filter: {
    circleId?: string;
    userId?: string;
    type?: LedgerEntryType;
    limit?: number;
}) {
    return prisma.userLedgerEntry.findMany({
        where: {
            circleId: filter.circleId,
            userId: filter.userId,
            type: filter.type
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: filter.limit || 50,
        include: {
            user: { select: { name: true, email: true } },
            admin: { select: { name: true } }
        }
    });
}

/**
 * Transforms ledger entries into a structured grid for the Transparency View.
 * Groups by Round -> Members
 */
export async function getCircleLedgerGrid(circleId: string) {
    // 1. Fetch relevant entries
    const entries = await prisma.userLedgerEntry.findMany({
        where: {
            circleId,
            OR: [
                { type: LedgerEntryType.CONTRIBUTION_MARKED_PAID },
                { type: LedgerEntryType.CONTRIBUTION_CONFIRMED },
                { type: LedgerEntryType.CONTRIBUTION_OBLIGATION_CREATED },
                { type: LedgerEntryType.PAYOUT_DISTRIBUTED }
            ]
        },
        include: { user: true },
        orderBy: { createdAt: 'asc' }
    });

    // 2. Fetch Circle Members to ensure we show everyone
    const circle = await prisma.circle.findUnique({
        where: { id: circleId },
        include: { members: { include: { user: true } } }
    });

    if (!circle) return null;

    // 3. Construct Grid
    // Map<RoundNumber, Map<UserId, Status>>
    const grid: Record<number, {
        roundId: number;
        payoutRecipient?: { id: string, name: string };
        contributions: Record<string, {
            status: 'pending' | 'paid' | 'confirmed' | 'late' | 'missing';
            amount: number;
            paidAt?: Date;
        }>
    }> = {};

    // Initialize Grid with Obligations (or defaulting to predicted rounds)
    // For MVP, let's assume rounds 1..MaxMembers
    for (let i = 1; i <= circle.maxMembers; i++) {
        grid[i] = {
            roundId: i,
            contributions: {}
        };
        // Init all members as 'pending'
        circle.members.forEach(m => {
            grid[i].contributions[m.userId] = {
                status: 'pending',
                amount: circle.amount
            };
        });
    }

    // Apply Ledger Events
    for (const entry of entries) {
        // We need a way to know WHICH round an entry belongs to.
        // Ideally 'metadata.round' exists. If not, we infer or skip?
        // Fallback: For MVP, assume entries without metadata apply to the 'current' obligation or first unpaid.
        // BETTER: We only trust entries with metadata info for now or we build logic.
        const round = (entry.metadata as any)?.round || 1; // Default to 1 if missing for now

        if (!grid[round]) continue;

        if (entry.type === LedgerEntryType.CONTRIBUTION_MARKED_PAID) {
            if (entry.userId) {
                grid[round].contributions[entry.userId].status = 'paid';
                grid[round].contributions[entry.userId].paidAt = entry.createdAt;
            }
        }
        else if (entry.type === LedgerEntryType.CONTRIBUTION_CONFIRMED) {
            if (entry.userId) {
                grid[round].contributions[entry.userId].status = 'confirmed';
            }
        }
        else if (entry.type === LedgerEntryType.PAYOUT_DISTRIBUTED) {
            // Who got the pot?
            if (entry.userId && entry.user) {
                grid[round].payoutRecipient = {
                    id: entry.userId,
                    name: entry.user.name
                };
            }
        }
    }

    return {
        circleName: circle.name,
        currency: 'USD',
        amount: circle.amount,
        members: circle.members.map(m => ({ id: m.userId, name: m.user.name, avatar: m.user.avatar })),
        rounds: Object.values(grid)
    };
}
