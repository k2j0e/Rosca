"use strict";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function NotificationsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    // Get all ledger entries (notifications) for this user
    const notifications = await prisma.userLedgerEntry.findMany({
        where: {
            OR: [
                { userId: user.id },
                { adminId: user.id }
            ]
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            circle: { select: { id: true, name: true } },
            admin: { select: { name: true } },
            user: { select: { name: true } }
        }
    });

    // Get pending member requests for circles where user is admin
    const adminCircles = await prisma.circle.findMany({
        where: { adminId: user.id },
        include: {
            members: {
                where: { status: 'requested' },
                include: { user: true }
            }
        }
    });

    const pendingRequests = adminCircles.flatMap(circle =>
        circle.members.map(m => ({
            circleId: circle.id,
            circleName: circle.name,
            userId: m.userId,
            userName: m.user.name,
            userAvatar: m.user.avatar,
            requestedAt: m.joinedAt
        }))
    );

    // Format notification type for display
    const formatNotification = (type: string): { label: string; icon: string; color: string } => {
        const typeMap: Record<string, { label: string; icon: string; color: string }> = {
            'CONTRIBUTION_MARKED_PAID': { label: 'Marked payment as sent', icon: 'payments', color: 'text-blue-600 bg-blue-50' },
            'CONTRIBUTION_CONFIRMED': { label: 'Payment verified', icon: 'verified', color: 'text-green-600 bg-green-50' },
            'MEMBER_JOINED': { label: 'Member joined circle', icon: 'group_add', color: 'text-purple-600 bg-purple-50' },
            'PAYOUT_DISTRIBUTED': { label: 'Payout received', icon: 'savings', color: 'text-emerald-600 bg-emerald-50' },
            'CIRCLE_CREATED': { label: 'Circle created', icon: 'add_circle', color: 'text-primary bg-primary/10' },
            'MEMBER_APPROVED': { label: 'Member approved', icon: 'check_circle', color: 'text-green-600 bg-green-50' },
            'MEMBER_REJECTED': { label: 'Member removed', icon: 'remove_circle', color: 'text-red-600 bg-red-50' },
        };
        return typeMap[type] || { label: type.replace(/_/g, ' ').toLowerCase(), icon: 'info', color: 'text-gray-600 bg-gray-50' };
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-24 lg:pb-8 max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <Link href="/home" className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
                <h2 className="text-lg font-bold">Notifications</h2>
                <div className="w-12"></div>
            </div>

            <div className="p-4 flex flex-col gap-6">
                {/* Pending Member Requests */}
                {pendingRequests.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Pending Approvals
                        </h3>
                        <div className="flex flex-col gap-2">
                            {pendingRequests.map(req => (
                                <Link key={`${req.circleId}-${req.userId}`} href={`/circles/${req.circleId}/admin/members`}>
                                    <div className="flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                            {req.userAvatar ? (
                                                <img src={req.userAvatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-sm">{req.userName.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{req.userName}</p>
                                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Wants to join {req.circleName}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase">
                                            Review
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Activity Feed */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3">
                        Recent Activity
                    </h3>
                    {notifications.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-2">notifications_off</span>
                            <p className="text-text-sub dark:text-text-sub-dark">No notifications yet</p>
                            <p className="text-xs text-gray-400 mt-1">Activity will appear here as it happens</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {notifications.map(notif => {
                                const formatted = formatNotification(notif.type);
                                return (
                                    <div key={notif.id} className="flex items-start gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5">
                                        <div className={`w-10 h-10 rounded-full ${formatted.color} flex items-center justify-center shrink-0`}>
                                            <span className="material-symbols-outlined text-lg">{formatted.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{formatted.label}</p>
                                            {notif.circle && (
                                                <p className="text-xs text-text-sub dark:text-text-sub-dark truncate">{notif.circle.name}</p>
                                            )}
                                            {notif.description && (
                                                <p className="text-xs text-gray-400 mt-1 truncate">{notif.description}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                            {formatTimeAgo(notif.createdAt)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
