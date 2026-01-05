"use strict";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCircle, getCurrentUser } from "@/lib/data";

export default async function JoinCircleConfirm(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser();

    if (!circle) {
        notFound();
    }

    // Redirect if already a member
    if (currentUser && circle.members.some(m => m.userId === currentUser.id)) {
        redirect(`/circles/${circle.id}/dashboard`);
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
            {/* Progress Header */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <Link href={`/circles/${circle.id}`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <div className="flex gap-1">
                    <div className="w-16 h-1 rounded-full bg-primary overflow-hidden">
                        <div className="w-1/2 h-full bg-primary"></div>
                    </div>
                    <div className="w-16 h-1 rounded-full bg-primary/20"></div>
                </div>
                <div className="w-12"></div>
            </div>

            <div className="px-6 py-4 flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold leading-tight mb-2">
                    Confirm Your Commitment
                </h1>
                <p className="text-text-sub dark:text-text-sub-dark text-sm max-w-xs">
                    Review the details for <span className="font-bold text-text-main dark:text-white">{circle.name}</span> before committing.
                </p>
            </div>

            {/* Hero Value Card */}
            <div className="px-4 mb-6">
                <div className="bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col items-center">
                    <p className="text-white/80 font-medium text-sm mb-1 uppercase tracking-wide">Circle Savings</p>
                    <span className="text-5xl font-extrabold tracking-tight mb-4">${circle.payoutTotal.toLocaleString()}</span>

                    <div className="w-full h-px bg-white/20 mb-4"></div>

                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col items-center border-r border-white/20">
                            <span className="text-2xl font-bold">${circle.amount}</span>
                            <span className="text-white/80 text-xs">{circle.frequency} contribution</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{circle.duration}</span>
                            <span className="text-white/80 text-xs">rounds</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details List */}
            <div className="px-6 flex flex-col gap-6 mb-8">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mt-1">
                        <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main dark:text-white">Starts {new Date(circle.startDate).toLocaleDateString()}</h3>
                        <p className="text-sm text-text-sub dark:text-text-sub-dark leading-snug">
                            Your first contribution is due on this date. Consistent contributions build trust within your community.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mt-1">
                        <span className="material-symbols-outlined">lock_clock</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main dark:text-white">Duration: {circle.duration} Rounds</h3>
                        <p className="text-sm text-text-sub dark:text-text-sub-dark leading-snug">
                            You are committing to the full saving cycle. This ensures everyone receives their turn.
                        </p>
                    </div>
                </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-auto px-6 pb-6">
                <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary transition-colors cursor-pointer mb-4">
                    <input type="checkbox" className="mt-1 w-5 h-5 accent-primary rounded-md" />
                    <span className="text-sm text-text-sub dark:text-text-sub-dark leading-snug">
                        I understand that this is a shared saving commitment, and that members take turns accessing the group's savings. I agree to the <span className="font-bold text-text-main dark:text-white underline">Circle Rules</span>.
                    </span>
                </label>

                <Link href={`/circles/${circle.id}/join/intent`}>
                    <button className="w-full h-14 bg-text-main dark:bg-white text-white dark:text-text-main font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
                        Commit to This Circle
                        <span className="material-symbols-outlined">check_circle</span>
                    </button>
                </Link>
            </div>

        </div>
    );
}
