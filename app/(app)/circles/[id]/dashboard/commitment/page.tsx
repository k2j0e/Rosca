"use strict";


import { notFound, redirect } from "next/navigation";
import { getCircle, getCurrentUser, MOCK_USER, updateMemberStatus, joinCircle } from "@/lib/data";
import { markContributionPaidAction } from "@/app/actions";

export default async function DashboardCommitment(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser() || MOCK_USER;

    if (!circle) {
        notFound();
    }

    const myMember = currentUser ? circle.members.find(m => m.userId === currentUser.id) : null;
    const isMember = !!myMember;

    // Dynamic Date Calculation
    const today = new Date();
    const startDate = new Date(circle.startDate);

    // Calculate next payment date based on frequency
    let nextPaymentDate: Date;
    if (circle.frequency === 'weekly') {
        nextPaymentDate = new Date(today);
        nextPaymentDate.setDate(today.getDate() + (7 - today.getDay()) % 7 || 7);
    } else if (circle.frequency === 'bi-weekly') {
        nextPaymentDate = new Date(today);
        nextPaymentDate.setDate(today.getDate() + 14);
    } else {
        // Monthly - next 1st of month
        nextPaymentDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    }
    const nextPaymentDateStr = nextPaymentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Calculate current round based on start date and frequency
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / msPerDay);
    const daysPerRound = circle.frequency === 'weekly' ? 7 : circle.frequency === 'bi-weekly' ? 14 : 30;
    const currentRound = Math.max(1, Math.min(circle.duration, Math.ceil(daysSinceStart / daysPerRound) || 1));
    const progressPercent = Math.round((currentRound / circle.duration) * 100);

    // Trust Score from user profile
    const trustScore = currentUser?.trustScore || 115;

    return (
        <div className="flex flex-col h-full">

            {/* Title Section */}
            <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-400">
                        {isMember ? (myMember?.role === 'admin' ? 'Admin' : 'Member') : 'Guest'}
                    </span>
                    <span className="text-xs text-text-sub dark:text-text-sub-dark font-medium capitalize">
                        {circle.frequency} Cycle
                    </span>
                </div>
                <h1 className="text-3xl font-extrabold leading-tight text-left">
                    My Commitment
                </h1>
            </div>

            {/* Payment Card */}
            <div className="px-5 pb-6">
                <div className="flex flex-col items-stretch justify-start rounded-[32px] shadow-xl shadow-orange-500/5 dark:shadow-none bg-gradient-to-b from-orange-50 to-white dark:from-surface-dark dark:to-surface-dark overflow-hidden border border-orange-100 dark:border-white/5 relative group">
                    {/* Decorative Header */}
                    <div className="w-full h-32 bg-gradient-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-900/10 dark:to-amber-900/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <div className="flex w-full grow flex-col items-stretch justify-center gap-1 -mt-24 px-6 pb-8 relative z-10">
                        {/* Status Badge */}
                        <div className="flex justify-start mb-5">
                            <div className="bg-white dark:bg-[#2A2A2A] border border-gray-100 dark:border-white/10 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                                {myMember?.status === 'requested' ? (
                                    <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-main dark:text-white">
                                            Awaiting Approval
                                        </span>
                                    </>
                                ) : myMember?.status === 'paid_pending' ? (
                                    <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                            Waiting for Recipient
                                        </span>
                                    </>
                                ) : myMember?.status === 'recipient_verified' ? (
                                    <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                            Verified - Awaiting Admin
                                        </span>
                                    </>
                                ) : myMember?.status === 'paid' ? (
                                    <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                                            Payment Complete
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-main dark:text-white">
                                            Payment Due Soon
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Amount & Date */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-text-sub dark:text-text-sub-dark text-sm font-medium mb-1">
                                    Due Date
                                </p>
                                <h2 className="text-4xl font-extrabold tracking-tight text-text-main dark:text-white mb-3">
                                    {nextPaymentDateStr}
                                </h2>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-text-sub dark:text-text-sub-dark font-medium text-lg">Amount:</span>
                                    <span className="text-text-main dark:text-white font-bold text-xl">
                                        ${circle.amount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 dark:bg-white/5 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-white/5">
                                <span className="material-symbols-outlined text-[28px]">
                                    calendar_month
                                </span>
                            </div>
                        </div>

                        {/* Context Note */}
                        <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 flex gap-4 items-start">
                            <div className="bg-white dark:bg-surface-dark p-2 rounded-full shadow-sm shrink-0 text-orange-500">
                                <span className="material-symbols-outlined text-[20px]">
                                    volunteer_activism
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-text-sub dark:text-text-sub-dark leading-relaxed font-medium">
                                    Your contribution creates opportunity. This cycle, you are helping the circle reach its <span className="font-bold text-text-main dark:text-white">${circle.payoutTotal.toLocaleString()}</span> goal.
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        {myMember?.status === 'requested' ? (
                            <button disabled className="w-full h-14 bg-gray-200 text-gray-500 font-bold text-lg rounded-full flex items-center justify-center gap-2 cursor-not-allowed">
                                Pending Approval
                                <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                            </button>
                        ) : myMember?.status === 'paid_pending' ? (
                            <button disabled className="w-full h-14 bg-amber-100 text-amber-600 font-bold text-lg rounded-full flex items-center justify-center gap-2 cursor-wait">
                                Waiting for Recipient to Confirm
                                <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
                            </button>
                        ) : myMember?.status === 'recipient_verified' ? (
                            <button disabled className="w-full h-14 bg-blue-100 text-blue-600 font-bold text-lg rounded-full flex items-center justify-center gap-2 cursor-wait">
                                Verified - Awaiting Admin Approval
                                <span className="material-symbols-outlined text-[20px]">verified</span>
                            </button>
                        ) : myMember?.status !== 'paid' ? (
                            <form action={markContributionPaidAction.bind(null, circle.id)}>
                                <button type="submit" className="w-full h-14 bg-[#F25F15] text-white font-bold text-lg rounded-full shadow-lg shadow-orange-500/20 hover:bg-[#d64e0c] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    Mark as Paid
                                    <span className="material-symbols-outlined text-[22px]">check</span>
                                </button>
                            </form>
                        ) : (
                            <button disabled className="w-full h-14 bg-green-500 text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 opacity-100 cursor-default shadow-lg shadow-green-500/20">
                                Contribution Received
                                <span className="material-symbols-outlined text-[22px]">verified</span>
                            </button>
                        )}

                        <div className="text-center mt-4">
                            <button className="text-xs text-text-sub dark:text-text-sub-dark hover:text-text-main dark:hover:text-white transition-colors decoration-gray-300 dark:decoration-white/30 underline decoration-1 underline-offset-2">
                                Report an issue with this payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Score Card */}
            <div className="px-5 pb-8">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-[#E8FBF5] dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-500/10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-surface-dark rounded-full text-[#0FAE7A] dark:text-emerald-400 shadow-sm">
                            <span className="material-symbols-outlined text-[24px]">
                                workspace_premium
                            </span>
                        </div>
                        <div>
                            <p className="text-[#053F2E] dark:text-emerald-100 font-bold text-base">Trust Score</p>
                            <p className="text-[#0FAE7A] dark:text-emerald-400 text-xs font-medium">
                                Top 10% of contributors
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-extrabold text-[#053F2E] dark:text-white tracking-tight">
                            {trustScore}
                        </p>
                        <p className="text-[10px] text-[#0FAE7A] dark:text-emerald-400/80 uppercase tracking-widest font-bold">
                            Points
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-2 bg-gray-50 dark:bg-white/5 border-t border-b border-gray-100 dark:border-white/5"></div>

            {/* Cycle Progress */}
            <div className="p-5 pb-10">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-6 justify-between items-end">
                        <div>
                            <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight">
                                Cycle Progress
                            </h3>
                            <p className="text-text-sub dark:text-text-sub-dark text-sm font-medium mt-1">
                                Round {currentRound} of {circle.duration}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-[#F25F15]">{progressPercent}%</span>
                        </div>
                    </div>
                    <div className="relative pt-2">
                        <div className="overflow-hidden h-2.5 mb-2 text-xs flex rounded-full bg-gray-100 dark:bg-white/10">
                            <div
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#F25F15] rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-text-sub dark:text-text-sub-dark uppercase tracking-wide">
                            <span>Start</span>
                            <span>Finish</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
