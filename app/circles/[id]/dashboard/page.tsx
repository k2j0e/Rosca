"use strict";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCircle, getCurrentUser } from "@/lib/data";

export default async function CircleDashboard(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser(); // Get real user

    if (!circle) {
        notFound();
    }

    // Calculate progress
    const totalMembers = circle.members.length;
    const currentPayoutIndex = 0; // Fixed for MVP
    const nextPayoutDate = new Date(circle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const collectedAmount = circle.amount * 3; // Mock collected amount
    const progress = (collectedAmount / circle.payoutTotal) * 100;

    // Find current user's status
    const myMember = circle.members.find(m => m.userId === currentUser?.id);
    const isPaid = myMember?.status === 'paid';

    return (


        <div className="px-4 py-6 flex flex-col gap-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Personal Status Card */}
            {myMember && (
                <div className="flex items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            <span className="material-symbols-outlined">{isPaid ? 'check' : 'priority_high'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Round 1 Contribution</span>
                            <span className={`text-xs ${isPaid ? 'text-green-600' : 'text-orange-600'} font-medium`}>
                                {isPaid ? 'Paid on time' : 'Due Now'}
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

            {/* Hero Summary Card */}
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


            {/* Floating Action Button (Only show if pending) */}
            {
                !isPaid && (
                    <Link href={`/circles/${circle.id}/dashboard/commitment`} className="fixed bottom-6 right-6 z-40 animate-in zoom-in duration-300">
                        <button className="flex items-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined">payments</span>
                            <span className="font-bold">Make Contribution</span>
                        </button>
                    </Link>
                )
            }

        </div >
    );
}
