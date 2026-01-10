"use strict";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCircle, getCurrentUser } from "@/lib/data";

export default async function JoinCircleConfirm(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser();

    if (!circle) {
        redirect('/home?error=circle_not_found');
    }

    if (!currentUser) {
        redirect(`/signin?redirect=${encodeURIComponent(`/circles/${circle.id}/join`)}`);
    }

    // Redirect if already a member
    if (currentUser && circle.members.some(m => m.userId === currentUser.id)) {
        redirect(`/circles/${circle.id}/dashboard`);
    }

    // Calculate potential payout position
    const currentMemberCount = circle.members.length;
    const yourPosition = currentMemberCount + 1;
    const earliestRound = Math.min(yourPosition, 2); // Could be as early as round 2 if admin assigns
    const latestRound = circle.maxMembers;

    // Get coordinator
    const coordinator = circle.members.find(m => m.role === 'admin');

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">

            {/* Hero Cover Image */}
            <div className="relative w-full h-40 overflow-hidden">
                {circle.coverImage ? (
                    <img
                        src={circle.coverImage}
                        alt={circle.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-orange-100 to-amber-50 dark:from-primary/30 dark:via-orange-900/20 dark:to-amber-900/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background-light dark:to-background-dark" />

                {/* Back Button */}
                <Link
                    href={`/circles/${circle.id}`}
                    className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-lg"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </Link>

                {/* Step indicator */}
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    Step 1 of 2
                </div>
            </div>

            {/* Commitment Header */}
            <div className="px-6 pt-4 pb-2 text-center">
                <h1 className="text-2xl font-extrabold leading-tight mb-1">
                    Ready to Commit?
                </h1>
                <p className="text-text-sub dark:text-text-sub-dark text-sm">
                    Joining <span className="font-bold text-text-main dark:text-white">{circle.name}</span>
                </p>
            </div>

            {/* Your Payout Position Calculator */}
            <div className="px-4 py-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-800/30">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-green-600">calendar_today</span>
                        <span className="font-bold text-green-900 dark:text-green-300">Your Potential Payout</span>
                    </div>
                    <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed mb-3">
                        You'll be member <span className="font-bold">#{yourPosition}</span> of {circle.maxMembers}.
                        Based on coordinator assignment, you could receive your <span className="font-bold">${circle.payoutTotal.toLocaleString()}</span> payout:
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white dark:bg-black/20 rounded-xl p-3 text-center">
                            <span className="block text-2xl font-black text-green-700 dark:text-green-400">Round {earliestRound}</span>
                            <span className="text-xs text-green-600 dark:text-green-500">Earliest</span>
                        </div>
                        <div className="flex items-center text-green-400">→</div>
                        <div className="flex-1 bg-white dark:bg-black/20 rounded-xl p-3 text-center">
                            <span className="block text-2xl font-black text-gray-600 dark:text-gray-400">Round {latestRound}</span>
                            <span className="text-xs text-gray-500">Latest</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coordinator Trust Signal */}
            <div className="px-4 mb-4">
                <div className="flex gap-3 items-center p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div
                        className="w-12 h-12 rounded-full bg-gray-300 bg-cover bg-center shrink-0 ring-2 ring-primary"
                        style={{ backgroundImage: coordinator?.avatar ? `url("${coordinator.avatar}")` : undefined }}
                    >
                        {!coordinator?.avatar && (
                            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {coordinator?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-text-main dark:text-white">{coordinator?.name || 'Coordinator'}</span>
                            <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">Coordinator</span>
                        </div>
                        <p className="text-text-sub dark:text-text-sub-dark text-xs">
                            Will manage payouts and verify contributions
                        </p>
                    </div>
                    <span className="material-symbols-outlined text-green-500">verified</span>
                </div>
            </div>

            {/* Quick Recap (minimal) */}
            <div className="px-4 mb-4">
                <div className="flex justify-between text-sm p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <span className="text-text-sub dark:text-text-sub-dark">Your commitment</span>
                    <span className="font-bold">${circle.amount}/{circle.frequency}</span>
                </div>
            </div>

            {/* Agreement Section */}
            <div className="mt-auto px-4 pb-6">
                {/* Key commitments */}
                <div className="mb-4 space-y-2">
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors cursor-pointer">
                        <input type="checkbox" className="mt-0.5 w-5 h-5 accent-primary rounded" />
                        <span className="text-sm text-text-main dark:text-white leading-snug">
                            I will contribute <strong>${circle.amount}</strong> every <strong>{circle.frequency === 'weekly' ? 'week' : circle.frequency === 'bi-weekly' ? '2 weeks' : 'month'}</strong> for <strong>{circle.duration} rounds</strong>.
                        </span>
                    </label>
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors cursor-pointer">
                        <input type="checkbox" className="mt-0.5 w-5 h-5 accent-primary rounded" />
                        <span className="text-sm text-text-main dark:text-white leading-snug">
                            I understand that members who receive earlier are supported by those who receive later.
                        </span>
                    </label>
                </div>

                <Link href={`/circles/${circle.id}/join/intent`}>
                    <button className="w-full h-14 bg-primary text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all">
                        Continue
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </Link>

                <p className="text-center text-xs text-text-sub dark:text-text-sub-dark mt-3">
                    Next: Share why you're joining
                </p>
            </div>

        </div>
    );
}

