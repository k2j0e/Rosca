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

    const { stats, upcomingObligations, activeCircles, recentActivity } = data;

    // Format activity type for display
    const formatActivityType = (type: string) => {
        const typeMap: Record<string, { label: string; icon: string; color: string }> = {
            'CONTRIBUTION_MARKED_PAID': { label: 'Marked paid', icon: 'payments', color: 'text-blue-600' },
            'CONTRIBUTION_CONFIRMED': { label: 'Payment verified', icon: 'verified', color: 'text-green-600' },
            'MEMBER_JOINED': { label: 'Joined circle', icon: 'group_add', color: 'text-purple-600' },
            'PAYOUT_DISTRIBUTED': { label: 'Received payout', icon: 'savings', color: 'text-emerald-600' },
        };
        return typeMap[type] || { label: type.replace(/_/g, ' ').toLowerCase(), icon: 'info', color: 'text-gray-600' };
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-24 lg:pb-8">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <div>
                    <p className="text-sm text-text-sub dark:text-text-sub-dark">Welcome back,</p>
                    <h1 className="text-2xl font-extrabold">{data.user.name.split(' ')[0]}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                    </button>
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {data.user.avatar ? (
                            <img src={data.user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-primary font-bold">{data.user.name.charAt(0)}</span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 pb-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-primary to-orange-500 p-4 rounded-2xl text-white">
                        <p className="text-xs font-medium opacity-80">Total Contributed</p>
                        <p className="text-2xl font-black">${stats.totalContributed.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl text-white">
                        <p className="text-xs font-medium opacity-80">Total Received</p>
                        <p className="text-2xl font-black">${stats.totalReceived.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        <p className="text-xs font-medium text-text-sub dark:text-text-sub-dark">Active Circles</p>
                        <p className="text-2xl font-black">{stats.activeCircles}</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        <p className="text-xs font-medium text-text-sub dark:text-text-sub-dark">Trust Score</p>
                        <p className="text-2xl font-black text-primary">{data.user.trustScore}</p>
                    </div>
                </div>
            </div>

            {/* Create Circle CTA */}
            <div className="px-4 pb-6">
                <Link href="/create/schedule">
                    <div className="bg-gradient-to-r from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900/20 p-5 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">add</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">Start a Circle</h3>
                                <p className="text-sm text-text-sub dark:text-text-sub-dark">Create a savings group with friends or family</p>
                            </div>
                            <span className="material-symbols-outlined text-primary">arrow_forward</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Upcoming Obligations */}
            {upcomingObligations.length > 0 && (
                <div className="px-4 pb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3">
                        Upcoming Payments
                    </h2>
                    <div className="space-y-2">
                        {upcomingObligations.map(ob => (
                            <Link key={ob.circleId} href={`/circles/${ob.circleId}/dashboard`}>
                                <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-800">
                                    <div className="w-10 h-10 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-yellow-700 dark:text-yellow-300">schedule</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">{ob.circleName}</p>
                                        <p className="text-xs text-text-sub dark:text-text-sub-dark">Due: ${ob.amount}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">arrow_forward_ios</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Circles */}
            {activeCircles.length > 0 && (
                <div className="px-4 pb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark">
                            Your Circles
                        </h2>
                        <Link href="/my-circles" className="text-primary text-xs font-bold">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {activeCircles.slice(0, 6).map(circle => (
                            <Link key={circle.id} href={`/circles/${circle.id}/dashboard`}>
                                <div className="flex items-center gap-3 bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        {circle.coverImage ? (
                                            <img src={circle.coverImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-400">savings</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm truncate">{circle.name}</p>
                                            {circle.role === 'admin' && (
                                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">Admin</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-text-sub dark:text-text-sub-dark">
                                            Round {circle.currentRound}/{circle.maxMembers} • ${circle.amount}/{circle.frequency}
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${circle.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        circle.status === 'recruiting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {circle.status}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {activeCircles.length === 0 && (
                <div className="px-4 pb-6">
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-2">groups</span>
                        <p className="text-text-sub dark:text-text-sub-dark font-medium">No active circles yet</p>
                        <p className="text-xs text-gray-400 mt-1">Create or join a circle to get started</p>
                        <Link href="/explore">
                            <button className="mt-4 px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm">
                                Explore Circles
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <div className="px-4 pb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3">
                        Recent Activity
                    </h2>
                    <div className="space-y-2">
                        {recentActivity.slice(0, 5).map(activity => {
                            const formatted = formatActivityType(activity.type);
                            return (
                                <div key={activity.id} className="flex items-center gap-3 py-2">
                                    <span className={`material-symbols-outlined ${formatted.color}`}>{formatted.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{formatted.label}</p>
                                        {activity.circleName && (
                                            <p className="text-xs text-text-sub dark:text-text-sub-dark truncate">{activity.circleName}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
