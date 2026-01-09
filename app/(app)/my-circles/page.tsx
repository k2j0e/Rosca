"use strict";

import Link from "next/link";
export const dynamic = 'force-dynamic';

import { getCircles, getCurrentUser, MemberStatus } from "@/lib/data";
import { ProgressRing } from "@/app/components/ProgressRing";

// Status pill helper
function getStatusPill(memberStatus: MemberStatus | undefined, circleStatus: string, isMyTurn: boolean) {
    // Priority: attention-needed states first
    if (memberStatus === 'pending') {
        return { text: "Contribution Due", color: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" };
    }
    if (memberStatus === 'paid_pending') {
        return { text: "Awaiting Verification", color: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400" };
    }
    if (isMyTurn) {
        return { text: "Your Turn!", color: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" };
    }
    if (circleStatus === 'recruiting') {
        return { text: "Recruiting", color: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400" };
    }
    if (circleStatus === 'active') {
        return { text: "In Progress", color: "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400" };
    }
    if (circleStatus === 'completed') {
        return { text: "Completed", color: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" };
    }
    return { text: "Pending", color: "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400" };
}

export default async function MyCirclesScreen() {
    const currentUser = await getCurrentUser();
    const circles = await getCircles();

    // Get user's circles with their member info
    const myCirclesWithMember = currentUser
        ? circles
            .filter(c => c.members.some(m => m.userId === currentUser.id))
            .map(c => {
                const myMember = c.members.find(m => m.userId === currentUser.id);
                const isMyTurn = myMember?.payoutMonth === c.currentRound;
                return {
                    circle: c,
                    memberStatus: myMember?.status as MemberStatus | undefined,
                    isAdmin: c.adminId === currentUser.id,
                    isMyTurn,
                };
            })
        : [];

    // Separate into categories
    const activeCircles = myCirclesWithMember.filter(c => c.circle.status === 'active');
    const recruitingCircles = myCirclesWithMember.filter(c => c.circle.status === 'recruiting');
    const completedCircles = myCirclesWithMember.filter(c => c.circle.status === 'completed');

    const hasCircles = myCirclesWithMember.length > 0;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#F6F8F7] dark:bg-background-dark pb-28 font-display">

            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2 sticky top-0 z-20 bg-[#F6F8F7]/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-2xl font-extrabold text-text-main dark:text-white tracking-tight">My Circles</h1>
                    <p className="text-text-muted text-xs font-medium">Save together. Complete the circle.</p>
                </div>
                <Link href="/create/financials">
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition">
                        <span className="material-symbols-outlined text-lg">add</span>
                        New
                    </button>
                </Link>
            </div>

            {hasCircles ? (
                <div className="flex flex-col gap-6 p-5 pt-4">

                    {/* ACTIVE CIRCLES */}
                    {activeCircles.length > 0 && (
                        <section>
                            <div className="mb-3">
                                <h2 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Active</h2>
                                <p className="text-xs text-text-muted font-medium">Circles currently in progress</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                {activeCircles.map(({ circle, memberStatus, isAdmin, isMyTurn }) => {
                                    const pill = getStatusPill(memberStatus, circle.status, isMyTurn);
                                    return (
                                        <Link key={circle.id} href={`/circles/${circle.id}/dashboard`}>
                                            <div className="flex items-center gap-4 bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 active:scale-[0.98] transition-all hover:border-primary/20">
                                                {/* Progress Ring */}
                                                <ProgressRing
                                                    current={circle.currentRound}
                                                    total={circle.duration}
                                                    size={56}
                                                    color="#2F7D6D"
                                                />

                                                {/* Circle Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-text-main dark:text-white truncate">{circle.name}</h3>
                                                        {isAdmin && (
                                                            <span className="material-symbols-outlined text-primary text-sm" title="Admin">verified_user</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-text-muted font-medium">
                                                        {circle.members.length} members · ${circle.amount}/{circle.frequency}
                                                    </p>
                                                    {isMyTurn && (
                                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                                                            Your payout: Round {circle.currentRound}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Status Pill */}
                                                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${pill.color}`}>
                                                    {pill.text}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* RECRUITING / PENDING CIRCLES */}
                    {recruitingCircles.length > 0 && (
                        <section>
                            <div className="mb-3">
                                <h2 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Pending</h2>
                                <p className="text-xs text-text-muted font-medium">Circles gathering members</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                {recruitingCircles.map(({ circle, memberStatus, isAdmin }) => {
                                    const pill = getStatusPill(memberStatus, circle.status, false);
                                    return (
                                        <Link key={circle.id} href={`/circles/${circle.id}/dashboard`}>
                                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-surface-dark/50 rounded-2xl p-4 border border-gray-100 dark:border-white/5 active:scale-[0.98] transition-all hover:border-primary/20">
                                                {/* Placeholder Ring */}
                                                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-gray-400 text-xl">hourglass_top</span>
                                                </div>

                                                {/* Circle Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-text-main dark:text-white truncate">{circle.name}</h3>
                                                        {isAdmin && (
                                                            <span className="material-symbols-outlined text-primary text-sm" title="Admin">verified_user</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-text-muted font-medium">
                                                        {circle.members.length}/{circle.maxMembers} members · ${circle.amount}/{circle.frequency}
                                                    </p>
                                                    <p className="text-xs text-text-muted mt-0.5">
                                                        Starting soon
                                                    </p>
                                                </div>

                                                {/* Status Pill */}
                                                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${pill.color}`}>
                                                    {pill.text}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* COMPLETED CIRCLES (Collapsible) */}
                    {completedCircles.length > 0 && (
                        <section>
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer mb-3 list-none">
                                    <div>
                                        <h2 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Completed</h2>
                                        <p className="text-xs text-text-muted font-medium">{completedCircles.length} completed circle{completedCircles.length > 1 ? 's' : ''}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-text-muted group-open:rotate-180 transition-transform">
                                        expand_more
                                    </span>
                                </summary>
                                <div className="flex flex-col gap-3">
                                    {completedCircles.map(({ circle, isAdmin }) => (
                                        <Link key={circle.id} href={`/circles/${circle.id}/dashboard`}>
                                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-surface-dark/30 rounded-2xl p-4 border border-gray-100 dark:border-white/5 opacity-75 hover:opacity-100 transition-all">
                                                {/* Completed Badge */}
                                                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">check_circle</span>
                                                </div>

                                                {/* Circle Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-text-main dark:text-white truncate">{circle.name}</h3>
                                                        {isAdmin && (
                                                            <span className="material-symbols-outlined text-primary text-sm" title="Admin">verified_user</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-text-muted font-medium">
                                                        {circle.members.length} members · ${circle.payoutTotal} saved
                                                    </p>
                                                </div>

                                                <span className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                                    Completed
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        </section>
                    )}
                </div>
            ) : (
                /* EMPTY STATE */
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-primary text-4xl">diversity_3</span>
                    </div>
                    <h3 className="font-bold text-xl text-text-main dark:text-white mb-2">
                        You're not in any circles yet
                    </h3>
                    <p className="text-text-muted text-sm mb-8 max-w-[280px] leading-relaxed">
                        Create one or join a group to start saving together.
                    </p>
                    <div className="flex flex-col gap-3 w-full max-w-[240px]">
                        <Link href="/create/financials" className="w-full">
                            <button className="w-full bg-primary text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/25 active:scale-95 transition-all">
                                Create a Circle
                            </button>
                        </Link>
                        <Link href="/explore" className="w-full">
                            <button className="w-full bg-white dark:bg-surface-dark text-text-main dark:text-white font-bold py-3.5 px-6 rounded-2xl border border-gray-200 dark:border-white/10 active:scale-95 transition-all">
                                Browse Public Circles
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
