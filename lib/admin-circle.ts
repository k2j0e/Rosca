import 'server-only';
import { prisma } from './db';
import { getCurrentUser } from './data';
import { recordLedgerEntry, LedgerEntryType, LedgerEntryDirection } from './ledger';

/**
 * Check if the current user is the admin of a given circle.
 */
export async function isCircleAdmin(circleId: string, userId?: string): Promise<boolean> {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) return false;

    const circle = await prisma.circle.findUnique({
        where: { id: circleId },
        select: { adminId: true }
    });

    return circle?.adminId === user.id;
}

/**
 * Require admin permission or throw error.
 */
export async function requireCircleAdmin(circleId: string): Promise<string> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized: Not logged in");

    const isAdmin = await isCircleAdmin(circleId, user.id);
    if (!isAdmin) throw new Error("Unauthorized: Not circle admin");

    return user.id;
}

/**
 * Log a circle admin action to the ledger with reason.
 */
export async function logCircleAdminAction(params: {
    circleId: string;
    adminId: string;
    type: LedgerEntryType;
    description: string;
    reason?: string;
    targetUserId?: string;
    metadata?: Record<string, any>;
}) {
    return recordLedgerEntry({
        type: params.type,
        direction: LedgerEntryDirection.NEUTRAL,
        description: params.description,
        circleId: params.circleId,
        adminId: params.adminId,
        userId: params.targetUserId,
        metadata: {
            ...params.metadata,
            reason: params.reason
        }
    });
}

/**
 * Get aggregated dashboard data for circle admin.
 */
export async function getCircleAdminDashboardData(circleId: string) {
    const circle = await prisma.circle.findUnique({
        where: { id: circleId },
        include: {
            members: {
                include: { user: true },
                orderBy: { payoutMonth: 'asc' }
            },
            announcements: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    if (!circle) return null;

    // Get recent admin actions from ledger
    const recentAdminActions = await prisma.userLedgerEntry.findMany({
        where: {
            circleId,
            adminId: { not: null }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
            admin: { select: { name: true } },
            user: { select: { name: true } }
        }
    });

    // Calculate health indicators
    const totalMembers = circle.members.filter(m => m.status !== 'requested').length;
    const paidMembers = circle.members.filter(m => m.status === 'paid' || m.status === 'paid_pending').length;
    const lateMembers = circle.members.filter(m => m.status === 'late').length;
    const pendingRequests = circle.members.filter(m => m.status === 'requested').length;

    return {
        circle: {
            id: circle.id,
            name: circle.name,
            status: circle.status,
            currentRound: circle.currentRound,
            maxMembers: circle.maxMembers,
            amount: circle.amount,
            frequency: circle.frequency,
            pausedAt: circle.pausedAt,
            pauseReason: circle.pauseReason
        },
        members: circle.members.map(m => ({
            id: m.id,
            userId: m.userId,
            name: m.user.name,
            avatar: m.user.avatar,
            role: m.role,
            status: m.status,
            payoutMonth: m.payoutMonth,
            graceApplied: m.graceApplied,
            graceReason: m.graceReason,
            dueDateExtension: m.dueDateExtension
        })),
        health: {
            totalMembers,
            paidCount: paidMembers,
            paidPercentage: totalMembers > 0 ? Math.round((paidMembers / totalMembers) * 100) : 0,
            lateCount: lateMembers,
            pendingRequests
        },
        recentActions: recentAdminActions.map(a => ({
            id: a.id,
            type: a.type,
            description: a.description,
            createdAt: a.createdAt,
            adminName: a.admin?.name,
            targetUserName: a.user?.name,
            reason: (a.metadata as any)?.reason
        })),
        announcements: circle.announcements
    };
}

/**
 * Get overdue members for a circle.
 */
export async function getOverdueMembers(circleId: string) {
    return prisma.member.findMany({
        where: {
            circleId,
            status: 'late'
        },
        include: {
            user: { select: { name: true, phoneNumber: true } }
        }
    });
}
