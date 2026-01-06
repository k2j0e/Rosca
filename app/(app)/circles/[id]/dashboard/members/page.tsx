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
            <div className="bg-gradient-to-br from-primary/5 via-orange-50 to-amber-50/50 dark:from-primary/10 dark:via-orange-900/10 dark:to-amber-900/5 rounded-3xl p-5 border border-primary/10 shadow-lg shadow-primary/5 overflow-hidden relative">
                {/* Animated background glow */}
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="flex items-center gap-2 mb-5 relative z-10">
                    <div className="p-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm">
                        <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main dark:text-white">Payout Queue</h3>
                        <p className="text-[11px] text-text-sub dark:text-text-sub-dark">Who gets paid next</p>
                    </div>
                </div>

                {/* Visual Timeline Queue */}
                <div className="relative flex items-center gap-0 overflow-x-auto pb-3 pt-2 px-2">
                    {/* Animated connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary/50 to-gray-200 dark:to-gray-700 rounded-full -translate-y-1/2 z-0" />
                    <div className="absolute top-1/2 left-0 h-1 bg-primary rounded-full -translate-y-1/2 z-0 animate-pulse" style={{ width: `${Math.min(100, (1 / sortedMembers.length) * 100 + 10)}%` }} />

                    {sortedMembers.map((member, idx) => {
                        const isMe = currentUser && member.userId === currentUser.id;
                        const isNext = idx === 0;
                        const position = member.payoutMonth || idx + 1;

                        return (
                            <div
                                key={member.userId}
                                className="flex flex-col items-center z-10 animate-in fade-in zoom-in-50 duration-500"
                                style={{
                                    animationDelay: `${idx * 100}ms`,
                                    animationFillMode: 'backwards'
                                }}
                            >
                                {/* Position marker */}
                                <div className={`text-[9px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full ${isNext ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-white/10 text-text-sub'
                                    }`}>
                                    {isNext ? 'Next' : `#${position}`}
                                </div>

                                {/* Avatar with effects */}
                                <div className={`relative p-1 rounded-full transition-all duration-500 ${isNext
                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30 scale-110'
                                        : isMe
                                            ? 'bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/30 scale-110'
                                            : 'bg-white dark:bg-gray-800'
                                    }`}>
                                    {/* Pulse ring for "Next" */}
                                    {isNext && (
                                        <>
                                            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
                                            <div className="absolute inset-[-4px] rounded-full border-2 border-green-400/50 animate-pulse" />
                                        </>
                                    )}

                                    <div
                                        className="w-12 h-12 rounded-full bg-cover bg-center bg-gray-200 dark:bg-gray-700 relative"
                                        style={{ backgroundImage: member.avatar ? `url('${member.avatar}')` : undefined }}
                                    >
                                        {!member.avatar && (
                                            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                                                {(member.name || '?')[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Name */}
                                <span className={`text-[11px] font-semibold mt-1.5 max-w-[60px] truncate text-center ${isMe ? 'text-primary' : 'text-text-main dark:text-white'
                                    }`}>
                                    {isMe ? 'You' : (member.name || 'Member').split(' ')[0]}
                                </span>

                                {/* YOU badge */}
                                {isMe && (
                                    <span className="text-[8px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full mt-0.5 animate-bounce">
                                        YOU
                                    </span>
                                )}

                                {/* Arrow connector (except last) */}
                                {idx < sortedMembers.length - 1 && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden xs:block">
                                        <span className="material-symbols-outlined text-primary/30 text-lg">chevron_right</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Empty slots indicator */}
                    {Array.from({ length: Math.max(0, circle.maxMembers - sortedMembers.length) }).slice(0, 3).map((_, idx) => (
                        <div key={`empty-${idx}`} className="flex flex-col items-center z-10 opacity-40">
                            <div className="text-[9px] font-bold text-gray-300 mb-1">#{sortedMembers.length + idx + 1}</div>
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-300 text-lg">person_add</span>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1">Open</span>
                        </div>
                    ))}
                </div>

                {/* Your Position Summary */}
                {myPayoutPosition && (
                    <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between bg-white/50 dark:bg-black/20 -mx-5 -mb-5 px-5 py-4 rounded-b-3xl">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">account_circle</span>
                            <span className="text-sm font-medium text-text-main dark:text-white">Your payout position</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-extrabold text-primary">#{myPayoutPosition}</span>
                            <span className="text-sm text-text-sub dark:text-text-sub-dark">of {circle.maxMembers}</span>
                        </div>
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
