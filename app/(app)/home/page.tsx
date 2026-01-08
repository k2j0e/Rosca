"use strict";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getCurrentUser } from "@/lib/data";
import { getHomePageData } from "@/lib/home-data";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    const data = await getHomePageData(user.id);

    if (!data) {
        redirect('/signin');
    }

    const { stats, upcomingObligations, activeCircles, recentActivity, pendingMemberRequests } = data;

    // Time ago helper (simplified)
    const timeAgo = (date: Date) => {
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-28 font-display">
            {/* Header */}
            <header className="pt-14 px-6 pb-4 flex items-center justify-between sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex flex-col">
                    <span className="text-text-muted text-sm font-medium tracking-wide mb-0.5">Welcome back</span>
                    <h1 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-2">
                        {data.user.name.split(' ')[0]}
                        <span className="material-symbols-outlined text-yellow-500 text-xl filled">waving_hand</span>
                    </h1>
                </div>
                <Link href="/profile" className="relative group cursor-pointer">
                    <div className="p-1 rounded-full border-2 border-white dark:border-white/10 shadow-sm bg-white dark:bg-white/10">
                        {data.user.avatar ? (
                            <img alt="Profile" className="w-10 h-10 rounded-full object-cover" src={data.user.avatar} />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {data.user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </Link>
            </header>

            <main className="flex-1 px-6 space-y-8">
                {/* Stats Section */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 bg-gradient-to-br from-primary to-[#FF4500] rounded-3xl p-5 text-white shadow-glow relative overflow-hidden flex flex-col justify-between h-48 group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-black/5 blur-lg"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                                <span className="material-symbols-outlined text-white text-[20px]">account_balance_wallet</span>
                            </div>
                        </div>
                        <div className="relative z-10 mt-2">
                            <span className="block text-white/80 text-xs font-semibold tracking-wider uppercase mb-1">Total Committed</span>
                            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">${stats.totalContributed.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="col-span-1 bg-surface-light dark:bg-surface-dark rounded-3xl p-5 shadow-card border border-white dark:border-white/5 relative flex flex-col justify-between h-48 group">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-primary-soft/30 dark:to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full bg-primary-soft dark:bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
                            </div>
                        </div>
                        <div className="relative z-10 mt-2">
                            <span className="block text-text-muted text-xs font-bold tracking-wider uppercase mb-1">Active Circles</span>
                            <div className="flex items-baseline gap-1">
                                <h2 className="text-4xl font-bold text-text-main dark:text-white">{stats.activeCircles}</h2>
                                <span className="text-sm text-text-muted font-medium">ongoing</span>
                            </div>
                            {/* Avatars of first 3 active circles */}
                            <div className="flex -space-x-2 mt-3 pl-1">
                                {activeCircles.slice(0, 3).map((circle, i) => (
                                    <div key={circle.id} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white dark:border-surface-dark ring-1 ring-gray-50 dark:ring-white/10 overflow-hidden">
                                        {circle.coverImage && <img src={circle.coverImage} className="w-full h-full object-cover" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Quick Actions</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                        <Link href="/create/financials" className="flex-1 min-w-[140px]">
                            <button className="w-full bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 active:scale-95 transition-all hover:border-primary/30 group">
                                <div className="w-14 h-14 rounded-full bg-primary-soft dark:bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">add_circle</span>
                                </div>
                                <span className="text-sm font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors">New Circle</span>
                            </button>
                        </Link>
                        <Link href="/explore" className="flex-1 min-w-[140px]">
                            <button className="w-full bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 active:scale-95 transition-all hover:border-blue-200 group">
                                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">explore</span>
                                </div>
                                <span className="text-sm font-semibold text-text-main dark:text-white group-hover:text-blue-500 transition-colors">Explore</span>
                            </button>
                        </Link>
                        {/* Placeholder for Payouts/History */}
                        <Link href="/my-circles" className="flex-1 min-w-[140px]">
                            <button className="w-full bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 active:scale-95 transition-all hover:border-purple-200 group">
                                <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">savings</span>
                                </div>
                                <span className="text-sm font-semibold text-text-main dark:text-white group-hover:text-purple-500 transition-colors">Circles</span>
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Upcoming Payments / Updates */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Updates</h3>
                        <Link href="/notifications" className="text-primary text-sm font-semibold hover:text-primary-hover transition-colors">View All</Link>
                    </div>
                    <div className="space-y-3">
                        {/* Admin Requests */}
                        {pendingMemberRequests.length > 0 && (
                            <Link href="/notifications">
                                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-white/5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined animate-pulse">person_add</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main dark:text-white text-sm">New Request</h4>
                                            <p className="text-xs text-text-muted mt-1">{pendingMemberRequests.length} pending requests</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                                </div>
                            </Link>
                        )}

                        {/* Payments Due */}
                        {upcomingObligations.map(ob => (
                            <Link key={'due-' + ob.circleId} href={`/circles/${ob.circleId}/dashboard`}>
                                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-white/5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer border-l-4 border-warning">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-warning flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main dark:text-white text-sm">Payment Due</h4>
                                            <p className="text-xs text-text-muted mt-1">${ob.amount} for {ob.circleName}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-semibold text-warning bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full mb-1">Due Now</span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Recent Activity */}
                        {recentActivity.slice(0, 5).map(activity => {
                            let icon = 'info';
                            let colorClass = 'bg-gray-50 text-gray-500';
                            let title = 'Activity';

                            switch (activity.type) {
                                case 'CONTRIBUTION_MARKED_PAID':
                                    icon = 'check_circle';
                                    colorClass = 'bg-blue-50 dark:bg-blue-900/20 text-blue-500';
                                    title = 'Marked Paid';
                                    break;
                                case 'CONTRIBUTION_CONFIRMED':
                                    icon = 'verified';
                                    colorClass = 'bg-green-50 dark:bg-green-900/20 text-green-500';
                                    title = 'Payment Verified';
                                    break;
                                case 'PAYOUT_DISTRIBUTED':
                                    icon = 'savings';
                                    colorClass = 'bg-purple-50 dark:bg-purple-900/20 text-purple-500';
                                    title = 'Payout Distributed';
                                    break;
                                case 'MEMBER_JOINED':
                                    icon = 'group_add';
                                    colorClass = 'bg-orange-50 dark:bg-orange-900/20 text-orange-500';
                                    title = 'New Member';
                                    break;
                            }

                            return (
                                <div key={activity.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-white/5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                            <span className="material-symbols-outlined">{icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main dark:text-white text-sm">{title}</h4>
                                            <p className="text-xs text-text-muted mt-1">{activity.circleName || 'General'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-text-muted">{timeAgo(activity.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
                <div className="h-4"></div>
            </main>
        </div>
    );
}
