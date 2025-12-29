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
