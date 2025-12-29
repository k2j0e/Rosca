import { prisma } from "./db";
import { LedgerEntryType } from "@prisma/client";

/**
 * Calculates and updates the Trust Score for a user based on their Ledger history.
 * Start: 100
 * Max: 850 (capped)
 * Min: 0 (floored)
 */
export async function recalculateTrustScore(userId: string) {
    if (!userId) return;

    try {
        // 1. Fetch all relevant ledger entries
        const entries = await prisma.userLedgerEntry.findMany({
            where: { userId },
            select: { type: true }
        });

        // 2. Fetch completed circles count (from stats or calculated)
        // For now, let's rely on the ledger optimization: if we had a "CIRCLE_COMPLETED" event, we'd use that.
        // Or we can just fetch the user to get current stats if we trust them, but let's recalculate from scratch if possible.
        // MVP: Just use ledger events for now.

        let score = 100; // Base Score

        for (const entry of entries) {
            switch (entry.type) {
                case LedgerEntryType.CONTRIBUTION_MARKED_PAID:
                    score += 5;
                    break;
                case LedgerEntryType.CONTRIBUTION_CONFIRMED:
                    score += 10;
                    break;
                case LedgerEntryType.CONTRIBUTION_MARKED_UNPAID:
                    score -= 30;
                    break;
                case LedgerEntryType.CONTRIBUTION_OVERDUE_FLAGGED:
                    score -= 10;
                    break;
                case LedgerEntryType.MEMBER_REMOVED:
                    score -= 100;
                    break;
                // Add more cases as needed
            }
        }

        // Cap and Floor
        if (score > 850) score = 850;
        if (score < 0) score = 0;

        console.log(`[Scoring] User ${userId} score calculated: ${score}`);

        // 3. Update User Record
        await prisma.user.update({
            where: { id: userId },
            data: { trustScore: score }
        });

    } catch (error) {
        console.error(`[Scoring] Failed to recalculate score for ${userId}`, error);
    }
}
