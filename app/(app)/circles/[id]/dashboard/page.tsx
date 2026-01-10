"use strict";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCircle, getCurrentUser, getCurrentRound } from "@/lib/data";
import InviteButton from "@/app/components/InviteButton";
import ShareLinkDisplay from "@/app/components/ShareLinkDisplay";
import RoundCelebration from "@/app/components/RoundCelebration";
import { confirmContributionAction } from "@/app/actions";

export default async function CircleDashboard(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser(); // Get real user

    if (!circle) {
        notFound();
    }

    // Calculate progress
    const totalMembers = circle.members.length;
    const currentRound = await getCurrentRound(circle.id);

    // Find recipient for this round (payoutMonth is 1-indexed usually, matching currentRound)
    const recipientMember = circle.members.find(m => m.payoutMonth === currentRound);
    const isRecipient = recipientMember?.userId === currentUser?.id;

    // Filter payments awaiting MY confirmation (if I am recipient)
    const paymentsToVerify = isRecipient
        ? circle.members.filter(m => m.status === 'paid_pending')
        : [];

    const nextPayoutDate = new Date(circle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const collectedAmount = circle.amount * 3; // Mock collected amount
    const progress = (collectedAmount / circle.payoutTotal) * 100;

    // Find current user's status
    const myMember = circle.members.find(m => m.userId === currentUser?.id);
    const isPaid = myMember?.status === 'paid' || myMember?.status === 'paid_pending' || myMember?.status === 'recipient_verified';

    return (


        <div className="px-4 py-6 flex flex-col gap-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RoundCelebration
                currentRound={currentRound}
                latestEvent={circle.events?.[0] ? {
                    type: circle.events[0].type,
                    timestamp: circle.events[0].timestamp
                } : undefined}
            />

            {/* Recipient Verification Card (High Priority) */}
            {isRecipient && paymentsToVerify.length > 0 && (
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-lg border-2 border-blue-500/20 animate-pulse-soft">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Confirm Receipts</h3>
                            <p className="text-xs text-text-sub dark:text-text-sub-dark">
                                {paymentsToVerify.length} members marked as paid. Did you receive the money?
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {paymentsToVerify.map(member => (
                            <div key={member.userId} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold overflow-hidden">
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            member.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="font-bold text-sm">{member.name}</span>
                                </div>
                                <form action={async () => {
                                    "use server";
                                    await confirmContributionAction(circle.id, member.userId);
                                }}>
                                    <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                        Confirm
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Personal Status Card (Only show if active or completed) */}
            {myMember && circle.status !== 'recruiting' && (
                <div className="flex items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${myMember.status === 'paid' ? 'bg-green-100 text-green-600' :
                            myMember.status === 'recipient_verified' ? 'bg-blue-100 text-blue-600' :
                                myMember.status === 'paid_pending' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-orange-100 text-orange-600'
                            }`}>
                            <span className="material-symbols-outlined">
                                {myMember.status === 'paid' ? 'check_circle' :
                                    myMember.status === 'recipient_verified' ? 'verified' :
                                        myMember.status === 'paid_pending' ? 'hourglass_top' :
                                            'priority_high'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Round {currentRound} Contribution</span>
                            <span className={`text-xs font-medium ${myMember.status === 'paid' ? 'text-green-600' :
                                myMember.status === 'recipient_verified' ? 'text-blue-600' :
                                    myMember.status === 'paid_pending' ? 'text-yellow-600' :
                                        'text-orange-600'
                                }`}>
                                {myMember.status === 'paid' ? 'Complete' :
                                    myMember.status === 'recipient_verified' ? 'Verified by Recipient' :
                                        myMember.status === 'paid_pending' ? 'Waiting for Recipient' :
                                            'Due Now'}
                            </span>
                        </div>
                    </div>
                    {!isPaid && (
                        <button className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/20">
                            Pay ${circle.amount}
                        </button>
                    )}
                </div>
            )}

            {/* Conditional Hero Card */}
            {circle.status === 'recruiting' ? (
                // recruiting State Banner
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-500/20 text-white flex flex-col gap-6 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                                Recruiting Phase
                            </span>
                            <span className="material-symbols-outlined text-white/50">group_add</span>
                        </div>

                        <h2 className="text-2xl font-bold leading-tight mb-2">Waiting for Members</h2>
                        <p className="text-white/80 text-sm mb-6">
                            This circle will launch once {circle.maxMembers} members have joined.
                        </p>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-bold text-white/80 uppercase tracking-wide">
                                <span>{totalMembers} / {circle.maxMembers} Joined</span>
                                <span>{Math.round((totalMembers / circle.maxMembers) * 100)}% Ready</span>
                            </div>
                            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${(totalMembers / circle.maxMembers) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <InviteButton
                                circleId={circle.id}
                                circleName={circle.name}
                                inviteCode={circle.inviteCode || undefined}
                                text="Invite"
                                className="flex-1 bg-white text-blue-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg cursor-pointer"
                            />

                            {myMember?.role === 'admin' && (
                                <form action={async () => {
                                    "use server";
                                    // Use dynamic import to avoid potential circular dep issues during this massive refactor, 
                                    // though standard import is usually fine. Sticking to current pattern for safety 
                                    // unless we want to change top-level imports.
                                    const { launchCircleAction } = await import("@/app/actions");
                                    await launchCircleAction(circle.id);
                                }} className="flex-1">
                                    <button
                                        type="submit"
                                        disabled={totalMembers < 1}
                                        className="w-full bg-blue-900/30 border border-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                        Launch
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Share Link Display */}
                        <ShareLinkDisplay circleId={circle.id} inviteCode={circle.inviteCode || undefined} />
                    </div>
                </div>
            ) : (
                // Active State Hero (Existing Code)
                <div className="bg-gradient-to-br from-primary to-orange-600 p-6 rounded-3xl shadow-xl shadow-orange-500/20 text-white flex flex-col gap-6 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex flex-col">
                            <span className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Current Pot</span>
                            <span className="text-4xl font-extrabold tracking-tight">${circle.payoutTotal.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 flex flex-col items-center">
                            <span className="text-[10px] font-medium text-white/80 uppercase">Payout</span>
                            <span className="font-bold text-lg leading-tight">{nextPayoutDate}</span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex justify-between text-xs font-medium text-white/80">
                            <span>Collecting</span>
                            <span>{Math.round(progress)}% Goal</span>
                        </div>
                        <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="text-[10px] text-white/60 text-center mt-1">
                            ${collectedAmount.toLocaleString()} of ${circle.payoutTotal.toLocaleString()} collected
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Feed */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pl-2">
                    <h3 className="font-bold text-text-sub dark:text-text-sub-dark text-sm uppercase tracking-wider">Activity</h3>
                    {/* <span className="text-xs text-primary font-bold">View All</span> */}
                </div>

                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-white/10 ml-2 space-y-8">
                    {/* Today Marker - optional depending on date logic */}
                    {/* <div className="absolute -left-[5px] -top-2 bg-background-light dark:bg-background-dark px-1 text-[10px] font-bold text-text-sub uppercase">Today</div> */}

                    {(circle.events || []).map((event) => (
                        <div key={event.id} className="relative pl-6">
                            {/* Icon/Avatar Logic */}
                            <div className="absolute -left-[18px] top-1">
                                {event.type === 'join' || event.type === 'payment' ? (
                                    <div className="w-8 h-8 rounded-full border-4 border-background-light dark:border-background-dark bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url('${event.meta?.userAvatar || ''}')` }}></div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-4 border-background-light dark:border-background-dark bg-primary flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-[16px]">
                                            {event.type === 'round_start' ? 'play_arrow' : 'info'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={`flex flex-col gap-1 ${event.type === 'join' || event.type === 'payment' ? 'bg-white dark:bg-surface-dark p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-white/5' : 'py-1 opacity-80'}`}>
                                {event.type === 'join' ? (
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-text-main dark:text-white">{event.meta?.userName} Joined</span>
                                        <span className="text-xs text-text-sub dark:text-text-sub-dark">Welcome to the circle!</span>
                                    </div>
                                ) : event.type === 'payment' ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm">{event.meta?.userName} paid</span>
                                            <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">On Time</span>
                                        </div>
                                        <span className="text-xs text-text-sub dark:text-text-sub-dark">{event.message}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium text-text-sub dark:text-text-sub-dark">{event.message}</span>
                                )}
                            </div>
                            <span className="text-[10px] text-text-sub pl-1 block mt-1">
                                {new Date(event.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    ))}

                    {(!circle.events || circle.events.length === 0) && (
                        <div className="pl-6 text-sm text-text-sub dark:text-text-sub-dark">
                            No activity yet.
                        </div>
                    )}
                </div>
            </div>


            {/* Floating Action Button (Only show if pending and NOT recruiting) */}
            {
                !isPaid && circle.status !== 'recruiting' && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40 animate-in slide-in-from-bottom-4 duration-500 pointer-events-none">
                        <Link href={`/circles/${circle.id}/dashboard/commitment`} className="block w-full pointer-events-auto">
                            <button className="w-full flex items-center justify-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main py-4 rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform">
                                <span className="material-symbols-outlined">payments</span>
                                <span className="font-bold">Make Contribution</span>
                            </button>
                        </Link>
                    </div>
                )
            }

        </div >
    );
}
