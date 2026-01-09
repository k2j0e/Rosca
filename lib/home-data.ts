import 'server-only';
import { prisma } from './db';
import { LedgerEntryType } from '@prisma/client';

export interface HomePageData {
    user: {
        id: string;
        name: string;
        trustScore: number;
        avatar: string | null;
    };
    stats: {
        totalCircles: number;
        activeCircles: number;      // Total circles user is in (active + recruiting)
        circlesActive: number;      // Only status === 'active'
        circlesRecruiting: number;  // Only status === 'recruiting'
        totalMembers: number;       // Total members across all circles
        totalContributed: number;
        totalReceived: number;
    };
    upcomingObligations: Array<{
        circleId: string;
        circleName: string;
        amount: number;
        dueDate: Date | null;
        status: string;
    }>;
    activeCircles: Array<{
        id: string;
        name: string;
        amount: number;
        frequency: string;
        currentRound: number;
        maxMembers: number;
        memberCount: number;
        status: string;
        role: string;
        coverImage: string | null;
    }>;
    recentActivity: Array<{
        id: string;
        type: string;
        description: string | null;
        createdAt: Date;
        circleName?: string;
    }>;
    pendingMemberRequests: Array<{
        circleId: string;
        circleName: string;
        userId: string;
        userName: string;
        userAvatar: string | null;
    }>;
}

/**
 * Fetch all data needed for the home page dashboard.
 */
export async function getHomePageData(userId: string): Promise<HomePageData | null> {
    // Get user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            trustScore: true,
            avatar: true
        }
    });

    if (!user) return null;

    // Get user's memberships
    const memberships = await prisma.member.findMany({
        where: { userId },
        include: {
            circle: {
                include: {
                    members: { select: { id: true } }
                }
            }
        }
    });

    // Filter active circles (not 'requested' status)
    const activeCircles = memberships
        .filter(m => m.status !== 'requested')
        .map(m => ({
            id: m.circle.id,
            name: m.circle.name,
            amount: m.circle.amount,
            frequency: m.circle.frequency,
            currentRound: m.circle.currentRound,
            maxMembers: m.circle.maxMembers,
            memberCount: m.circle.members.length,
            status: m.circle.status,
            role: m.role,
            coverImage: m.circle.coverImage
        }));

    // Calculate stats
    const totalCircles = memberships.filter(m => m.status !== 'requested').length;
    const circlesActive = activeCircles.filter(c => c.status === 'active').length;
    const circlesRecruiting = activeCircles.filter(c => c.status === 'recruiting').length;
    const totalMembers = activeCircles.reduce((sum, c) => sum + c.memberCount, 0);

    // Get contribution ledger entries for totals
    const contributions = await prisma.userLedgerEntry.findMany({
        where: {
            userId,
            type: { in: [LedgerEntryType.CONTRIBUTION_CONFIRMED, LedgerEntryType.CONTRIBUTION_MARKED_PAID] }
        },
        select: { amount: true }
    });

    const payouts = await prisma.userLedgerEntry.findMany({
        where: {
            userId,
            type: LedgerEntryType.PAYOUT_DISTRIBUTED
        },
        select: { amount: true }
    });

    const totalContributed = contributions.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalReceived = payouts.reduce((sum, e) => sum + (e.amount || 0), 0);

    // Get upcoming obligations (circles where user is pending payment)
    const upcomingObligations = memberships
        .filter(m => m.status === 'pending' && m.circle.status === 'active')
        .map(m => ({
            circleId: m.circle.id,
            circleName: m.circle.name,
            amount: m.circle.amount,
            dueDate: m.dueDateExtension, // Extended due date if any
            status: m.status
        }));

    // Get recent activity (last 10 ledger entries)
    const recentEntries = await prisma.userLedgerEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
            circle: { select: { name: true } }
        }
    });

    const recentActivity = recentEntries.map(e => ({
        id: e.id,
        type: e.type,
        description: e.description,
        createdAt: e.createdAt,
        circleName: e.circle?.name
    }));

    // Get pending member requests for circles where user is admin
    const adminCircles = await prisma.circle.findMany({
        where: { adminId: userId },
        include: {
            members: {
                where: { status: 'requested' },
                include: { user: { select: { id: true, name: true, avatar: true } } }
            }
        }
    });

    const pendingMemberRequests = adminCircles.flatMap(circle =>
        circle.members.map(m => ({
            circleId: circle.id,
            circleName: circle.name,
            userId: m.user.id,
            userName: m.user.name,
            userAvatar: m.user.avatar
        }))
    );

    return {
        user,
        stats: {
            totalCircles,
            activeCircles: totalCircles,  // Total circles user is in
            circlesActive,
            circlesRecruiting,
            totalMembers,
            totalContributed,
            totalReceived
        },
        upcomingObligations,
        activeCircles,
        recentActivity,
        pendingMemberRequests
    };
}
