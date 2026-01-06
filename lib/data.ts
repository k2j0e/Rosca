import 'server-only';
import { prisma } from './db';
import { Prisma } from '@prisma/client';

// Re-export types for compatibility, though ideally we switch to Prisma types
export type MemberStatus = 'paid' | 'pending' | 'late' | 'requested' | 'paid_pending';
export type CircleCategory = 'Travel' | 'Business' | 'Emergency' | 'Education' | 'Home Improvement' | 'Debt Consolidation' | 'Wedding' | 'Gadgets' | 'Health/Medical' | 'Vehicle' | 'Other';

// Define interfaces that match the Prisma schema but with strict typing for JSON fields
export interface User {
    id: string;
    phoneNumber: string;
    name: string;
    email?: string; // Added for verification
    avatar: string;
    location?: string;
    bio?: string;
    trustScore: number;
    memberSince: string;
    role: 'user' | 'platform_admin' | 'support_agent' | 'read_only_analyst';
    isBanned: boolean; // Added for security
    // Auth Fields (Optional as they are not always needed in frontend)
    otpCode?: string | null;
    otpExpiresAt?: Date | string | null;
    hasCompletedOnboarding?: boolean;
    badges: string[];
    stats: {
        circlesCompleted: number;
        onTimePercentage: number;
        supportCount: number;
    };
    history: {
        id: string;
        type: 'contribution' | 'endorsement' | 'badge';
        title: string;
        subtitle: string;
        timestamp: string;
        meta?: any;
    }[];
}

export interface Member {
    userId: string;
    name?: string; // These are joined fields, often need flattening
    avatar?: string;
    joinedAt: string;
    role: 'admin' | 'member';
    payoutMonth?: number;
    payoutPreference?: 'early' | 'late' | 'any';
    status: MemberStatus;
}

export interface CircleEvent {
    id: string;
    type: 'payment' | 'join' | 'round_start' | 'info';
    message: string;
    timestamp: string;
    meta?: {
        userId?: string;
        userName?: string;
        userAvatar?: string;
        amount?: number;
    };
}

export interface Circle {
    id: string;
    name: string;
    category: CircleCategory;
    amount: number;
    frequency: 'weekly' | 'monthly' | 'bi-weekly';
    duration: number;
    payoutTotal: number;
    startDate: string;
    members: Member[];
    maxMembers: number;
    description?: string;
    rules?: string[];
    coverImage?: string;
    isPrivate: boolean;
    status: 'recruiting' | 'active' | 'completed';
    adminId: string;
    events: CircleEvent[];
    payoutSchedule?: string[]; // Array of ISO date strings
    settings?: {
        allowLateJoins?: boolean;
        requireVerification?: boolean;
    };
}

// Helper to map Prisma User to our User type (handling JSON parsing and Date serialization)
function mapUser(pUser: any): User {
    return {
        id: String(pUser.id),
        phoneNumber: String(pUser.phoneNumber),
        name: String(pUser.name || 'User'),
        email: pUser.email ? String(pUser.email) : undefined,
        avatar: String(pUser.avatar || ''),
        location: pUser.location ? String(pUser.location) : undefined,
        bio: pUser.bio ? String(pUser.bio) : undefined,
        trustScore: Number(pUser.trustScore || 0),
        memberSince: String(pUser.memberSince || '2025'),
        role: (pUser.role || 'user') as any,
        isBanned: Boolean(pUser.isBanned || false), // Ensure boolean
        hasCompletedOnboarding: Boolean(pUser.hasCompletedOnboarding || false),
        // Ensure arrays/objects, never null
        badges: Array.isArray(pUser.badges) ? pUser.badges : [],
        stats: pUser.stats && typeof pUser.stats === 'object' ? pUser.stats : { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 },
        history: Array.isArray(pUser.history) ? pUser.history : []
    };
}

import { cookies } from "next/headers";

// ... (existing helper function)

// --- User Session Management ---

export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('session_user_id')?.value;

        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        return user ? mapUser(user) : null;
    } catch (error: any) {
        console.error("CRITICAL ERROR getting current user:", error);
        // Fallback for debugging - remove this later
        return null;
    }
}

// This is no longer writing to a file, but updating the User record in DB
export async function updateUser(user: Partial<User> & { id: string }) {
    try {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                location: user.location,
                bio: user.bio,
                // Add other fields as necessary
            }
        });
    } catch (error) {
        console.error("Error updating user:", error);
    }
}

// Dropping this as it was session-file specific
export async function deleteUserSession() {
    // No-op for now
}

// --- User Registry ---

export async function registerUser(user: Partial<User>) {
    if (!user.phoneNumber || !user.name) return;

    try {
        await prisma.user.upsert({
            where: { phoneNumber: user.phoneNumber },
            update: { ...user },
            create: {
                ...user,
                // provide defaults
                trustScore: 850,
                memberSince: new Date().getFullYear().toString(),
            } as any
        });
    } catch (e) {
        console.error("Error registering user", e);
    }
}

export async function findUserByPhone(phone: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { phoneNumber: phone }
    });
    return user ? mapUser(user) : null;
}

// Helper: MOCK_USER logic is deprecated but let's keep a compat placeholder
export const MOCK_USER = null;

// --- Circle Operations ---

export async function getCircles(): Promise<Circle[]> {
    try {
        const circles = await prisma.circle.findMany({
            include: {
                members: { include: { user: true } },
                events: true,
                admin: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return circles.map(c => ({
            ...c,
            category: c.category as CircleCategory,
            frequency: c.frequency as any,
            status: c.status as any,
            startDate: c.startDate.toISOString(),
            description: (c.description || undefined) as string | undefined,
            coverImage: (c.coverImage || undefined) as string | undefined,
            members: c.members.map(m => ({
                userId: m.userId,
                name: m.user?.name || 'Unknown User',
                avatar: m.user?.avatar || '',
                joinedAt: m.joinedAt.toISOString(),
                role: m.role as any,
                status: m.status as any,
                payoutPreference: m.payoutPreference as any,
                payoutMonth: m.payoutMonth ?? undefined
            })),
            events: c.events.map(e => ({
                id: e.id,
                type: e.type as any,
                message: e.message,
                timestamp: e.timestamp.toISOString(),
                meta: e.meta as any
            })),
            payoutSchedule: (c.payoutSchedule as string[]) || undefined,
            settings: (c.settings as any) || undefined
        }));
    } catch (error) {
        console.error("Error fetching circles:", error);
        throw error; // Re-throw to make error visible in UI/Logs instead of showing empty list
    }
}

export async function getCircle(id: string): Promise<Circle | undefined> {
    const c = await prisma.circle.findUnique({
        where: { id },
        include: {
            members: { include: { user: true }, orderBy: { joinedAt: 'asc' } },
            events: { orderBy: { timestamp: 'desc' } },
            admin: true
        }
    });

    if (!c) return undefined;

    return {
        ...c,
        category: c.category as CircleCategory,
        frequency: c.frequency as any,
        status: c.status as any,
        startDate: c.startDate.toISOString(),
        description: (c.description || undefined) as string | undefined,
        coverImage: (c.coverImage || undefined) as string | undefined,
        members: c.members.map(m => ({
            userId: m.userId,
            name: m.user.name,
            avatar: m.user.avatar || '',
            joinedAt: m.joinedAt.toISOString(),
            role: m.role as any,
            status: m.status as any,
            payoutPreference: m.payoutPreference as any,
            payoutMonth: m.payoutMonth ?? undefined
        })),
        events: c.events.map(e => ({
            // ...e, 
            id: e.id,
            type: e.type as any,
            message: e.message,
            timestamp: e.timestamp.toISOString(),
            meta: e.meta as any
        })),
        payoutSchedule: (c.payoutSchedule as string[]) || undefined,
        settings: (c.settings as any) || undefined
    };
}

export async function createCircle(data: Partial<Circle>, creator: User) {
    const newCircle = await prisma.circle.create({
        data: {
            name: data.name || 'New Circle',
            category: data.category || 'Other',
            amount: data.amount || 0,
            frequency: data.frequency || 'monthly',
            duration: data.duration || 10,
            maxMembers: data.maxMembers || 10,
            payoutTotal: (data.amount || 0) * (data.duration || 10),
            startDate: new Date(),
            description: (data.description || undefined) as string | undefined,
            rules: data.rules || [],
            coverImage: (data.coverImage || undefined) as string | undefined,
            isPrivate: data.isPrivate || false,
            adminId: creator.id,

            // Advanced Settings & Status
            status: 'recruiting',
            payoutSchedule: data.payoutSchedule,
            settings: data.settings,

            members: {
                create: {
                    userId: creator.id,
                    role: 'admin',
                    status: 'pending'
                }
            },
            events: {
                create: {
                    type: 'info',
                    message: 'Circle created',
                    timestamp: new Date()
                }
            }
        },
        include: { members: true }
    });
    return newCircle;
}

export async function getMember(circleId: string, userId: string) {
    return prisma.member.findUnique({
        where: { userId_circleId: { userId, circleId } },
        include: { user: true }
    });
}

export async function joinCircle(circleId: string, user: User, preference: 'early' | 'late' | 'any' = 'any') {
    await prisma.$transaction(async (tx) => {
        // 1. Lock Circle & Check Bounds
        // We fetching the circle to get maxMembers
        const circle = await tx.circle.findUnique({
            where: { id: circleId },
            select: { maxMembers: true, status: true }
        });

        if (!circle) throw new Error("Circle not found");
        if (circle.status !== 'recruiting') {
            // Allow joining if active ONLY if invited/replacement (out of scope for now, strictly enforcing status)
            // Actually, for now, let's keep it strict.
            // If status is active, we usually lock it.
            // But existing logic didn't check status strictly here (checked in action).
            // Let's rely on action for status check but enforce COUNT here.
        }

        const currentCount = await tx.member.count({
            where: { circleId }
        });

        if (currentCount >= circle.maxMembers) {
            // Check if user is ALREADY a member
            const isMember = await tx.member.findUnique({
                where: { userId_circleId: { userId: user.id, circleId } }
            });
            if (isMember) return; // Idempotent success

            throw new Error(`Circle is full (${currentCount}/${circle.maxMembers})`);
        }

        // 2. Check if Member exists (Idempotency)
        const existing = await tx.member.findUnique({
            where: { userId_circleId: { userId: user.id, circleId } }
        });

        if (!existing) {
            await tx.member.create({
                data: {
                    circleId,
                    userId: user.id, // Using the ID from the passed user object
                    role: 'member',
                    status: 'requested', // Default to requested/pending compliance checks
                    payoutPreference: preference
                }
            });
        }
    });
}

export async function updateCircleMembers(circleId: string, members: Member[]) {
    // This is tricky. In Prisma, we update individual members.
    // The previous logic replaced the whole array in JSON.
    // Here we likely just want to update the payoutMonth or Order.

    // We can loop through and update.
    const updates = members.map((m, index) =>
        prisma.member.update({
            where: { userId_circleId: { userId: m.userId, circleId } },
            data: {
                payoutMonth: m.payoutMonth,
                // status: m.status
            }
        })
    );

    await prisma.$transaction(updates);
}

export async function updateMemberStatus(circleId: string, userId: string, newStatus: 'approved' | 'rejected' | MemberStatus) {
    if (newStatus === 'rejected') {
        await prisma.member.delete({
            where: { userId_circleId: { userId, circleId } }
        });
    } else {
        const status = newStatus === 'approved' ? 'pending' : newStatus; // Map 'approved' to 'pending' (waiting for payment)

        await prisma.member.update({
            where: { userId_circleId: { userId, circleId } },
            data: { status }
        });

        if (newStatus === 'approved' || newStatus === 'pending') {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user) {
                await prisma.circleEvent.create({
                    data: {
                        circleId,
                        type: 'join',
                        message: `${user.name} joined the circle`,
                        meta: { userId: user.id, userName: user.name, userAvatar: user.avatar }
                    }
                });
            }
        }
    }
}

export async function updateCircleStatus(circleId: string, status: 'active' | 'completed' | 'recruiting') {
    await prisma.circle.update({
        where: { id: circleId },
        data: { status }
    });

    if (status === 'active') {
        await prisma.circleEvent.create({
            data: {
                circleId,
                type: 'info',
                message: 'Circle officially started!',
                timestamp: new Date()
            }
        });
    }

    if (status === 'completed') {
        await prisma.circleEvent.create({
            data: {
                circleId,
                type: 'info',
                message: '🎉 Circle completed all rounds!',
                timestamp: new Date()
            }
        });
    }
}

/**
 * Determines the current round number for a circle based on PAYOUT_DISTRIBUTED events.
 * If no payouts have been distributed yet, we're in round 1.
 */
export async function getCurrentRound(circleId: string): Promise<number> {
    const { LedgerEntryType } = await import('@prisma/client');

    const payoutCount = await prisma.userLedgerEntry.count({
        where: {
            circleId,
            type: LedgerEntryType.PAYOUT_DISTRIBUTED
        }
    });

    // Current round = completed payouts + 1
    return payoutCount + 1;
}

/**
 * Resets all member statuses to 'pending' for a new round.
 * Called after a round is completed.
 */
export async function resetMemberStatusesForNewRound(circleId: string): Promise<void> {
    await prisma.member.updateMany({
        where: { circleId },
        data: { status: 'pending' }
    });

    // Log event
    await prisma.circleEvent.create({
        data: {
            circleId,
            type: 'round_start',
            message: 'New round started - contributions reset',
            timestamp: new Date()
        }
    });

    console.log(`[resetMemberStatusesForNewRound] All members reset to pending for circle ${circleId}`);
}

