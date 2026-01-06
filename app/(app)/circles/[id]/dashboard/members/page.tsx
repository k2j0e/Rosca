"use strict";

import { notFound } from "next/navigation";
import { getCircle, getCurrentUser } from "@/lib/data";
import InviteButton from "@/app/components/InviteButton";

export default async function DashboardMembers(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser();

    if (!circle) {
        notFound();
    }

    // Sort members by payout order
    const sortedMembers = [...(circle.members || [])].sort((a, b) => {
        if (a.payoutMonth && b.payoutMonth) return a.payoutMonth - b.payoutMonth;
        if (a.payoutMonth) return -1;
        if (b.payoutMonth) return 1;
        if (a.role === 'admin') return -1;
        if (b.role === 'admin') return 1;
        return (a.name || '').localeCompare(b.name || '');
    });

    const currentUserMember = currentUser ? circle.members.find(m => m.userId === currentUser.id) : null;
    const myPayoutPosition = currentUserMember?.payoutMonth;

    return (
        <div className="px-4 pt-6 pb-6 flex flex-col gap-6 w-full animate-in fade-in duration-500">

            {/* Payout Queue Visualization */}
            <div className="bg-gradient-to-br from-primary/5 to-orange-50 dark:from-primary/10 dark:to-orange-900/10 rounded-2xl p-5 border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary animate-pulse">queue</span>
                    <h3 className="font-bold text-text-main dark:text-white">Payout Queue</h3>
                </div>

                {/* Visual Queue */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                    {sortedMembers.map((member, idx) => {
                        const isMe = currentUser && member.userId === currentUser.id;
                        const isPast = member.payoutMonth && member.payoutMonth < 1; // TODO: Compare with current round
                        return (
                            <div
                                key={member.userId}
                                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${isMe
                                        ? 'bg-primary/20 ring-2 ring-primary scale-105'
                                        : 'hover:bg-white/50 dark:hover:bg-white/5'
                                    }`}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="relative">
                                    <div
                                        className={`w-10 h-10 rounded-full bg-cover bg-center border-2 ${isMe ? 'border-primary' : 'border-white dark:border-gray-700'
                                            } shadow-sm`}
                                        style={{ backgroundImage: member.avatar ? `url('${member.avatar}')` : undefined }}
                                    >
                                        {!member.avatar && (
                                            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500">
                                                {(member.name || '?')[0]}
                                            </div>
                                        )}
                                    </div>
                                    {idx === 0 && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                            <span className="material-symbols-outlined text-white text-[10px]">arrow_upward</span>
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold ${isMe ? 'text-primary' : 'text-text-sub dark:text-text-sub-dark'}`}>
                                    #{member.payoutMonth || idx + 1}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Your Position */}
                {myPayoutPosition && (
                    <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between">
                        <span className="text-sm text-text-sub dark:text-text-sub-dark">Your payout position</span>
                        <span className="text-lg font-extrabold text-primary">#{myPayoutPosition} of {circle.maxMembers}</span>
                    </div>
                )}
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">Circle Members</h2>
                    <span className="text-sm font-medium text-text-sub dark:text-text-sub-dark">({circle.members.length}/{circle.maxMembers})</span>
                </div>
                <InviteButton circleId={circle.id} />
            </div>

            {/* Member Cards with Profiles */}
            <div className="flex flex-col gap-3">
                {sortedMembers.map((member, idx) => {
                    const isMe = currentUser && member.userId === currentUser.id;
                    return (
                        <div
                            key={member.userId}
                            className={`bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-in slide-in-from-bottom-2 ${isMe ? 'border-primary/30 ring-1 ring-primary/10' : 'border-gray-100 dark:border-white/5'
                                }`}
                            style={{ animationDelay: `${idx * 75}ms` }}
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar with Position */}
                                <div className="relative shrink-0">
                                    <div
                                        className="w-14 h-14 rounded-xl bg-cover bg-center bg-gray-200 border border-gray-100 dark:border-white/10"
                                        style={{ backgroundImage: member.avatar ? `url('${member.avatar}')` : undefined }}
                                    >
                                        {!member.avatar && (
                                            <div className="w-full h-full rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                                                {(member.name || '?')[0]}
                                            </div>
                                        )}
                                    </div>
                                    {member.payoutMonth && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">
                                            {member.payoutMonth}
                                        </div>
                                    )}
                                </div>

                                {/* Member Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-text-main dark:text-white truncate">
                                            {isMe ? 'You' : member.name}
                                        </h3>
                                        {member.role === 'admin' && (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                                                <span className="material-symbols-outlined text-[12px]">shield</span>
                                                Admin
                                            </span>
                                        )}
                                        {isMe && (
                                            <span className="text-[10px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full animate-pulse">
                                                YOU
                                            </span>
                                        )}
                                    </div>

                                    {/* Member Intent/Bio */}
                                    <p className="text-xs text-text-sub dark:text-text-sub-dark line-clamp-2 mb-2">
                                        {member.payoutPreference === 'early'
                                            ? '🎯 Saving for an upcoming goal'
                                            : member.payoutPreference === 'late'
                                                ? '💰 Using this as long-term savings'
                                                : '✨ Flexible with payout timing'}
                                    </p>

                                    {/* Trust Indicators */}
                                    <div className="flex items-center gap-3 text-[10px]">
                                        <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
                                            <span className="material-symbols-outlined text-[14px]">verified</span>
                                            Verified
                                        </span>
                                        <span className="text-text-sub dark:text-text-sub-dark">
                                            Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Payout Status */}
                                <div className="shrink-0 flex flex-col items-end gap-1">
                                    {member.payoutMonth === 1 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold animate-pulse">
                                            <span className="material-symbols-outlined text-[14px]">savings</span>
                                            Next Up
                                        </span>
                                    ) : member.payoutMonth ? (
                                        <span className="text-xs font-medium text-text-sub dark:text-text-sub-dark">
                                            Round {member.payoutMonth}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">TBD</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {sortedMembers.length === 0 && (
                    <div className="text-center py-10 text-text-sub dark:text-text-sub-dark animate-in fade-in">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">group_off</span>
                        <p>No members yet. Invite your community!</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
                <p className="text-xs text-text-sub dark:text-text-sub-dark/70 max-w-xs mx-auto leading-relaxed">
                    💡 Members receive payouts in queue order. The coordinator assigns positions based on needs.
                </p>
            </div>
        </div>
    );
}
