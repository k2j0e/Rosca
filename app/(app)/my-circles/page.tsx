"use strict";

import Link from "next/link";
export const dynamic = 'force-dynamic';

import { getCircles, getCurrentUser } from "@/lib/data";

export default async function MyCirclesScreen() {
    const currentUser = await getCurrentUser();
    const circles = await getCircles();
    const myCircles = currentUser
        ? circles.filter(c => c.members.some(m => m.userId === currentUser.id))
        : [];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#F8F9FA] dark:bg-background-dark pb-6 lg:pb-8 font-display">

            {/* Header */}
            <div className="flex flex-col gap-1 p-6 pb-2 sticky top-0 z-20 bg-[#F8F9FA]/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">My Circles</h1>
                <p className="text-text-sub dark:text-text-sub-dark text-sm font-medium">Track your progress and commitments.</p>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
                {myCircles.length > 0 ? (
                    myCircles.map((circle) => {
                        const isAdmin = currentUser && circle.adminId === currentUser.id;
                        // Mock progress for now based on some stable hash of ID or just random if simpler, 
                        // but let's make it look somewhat realistic (e.g. 10-80%)
                        const progress = 10 + (parseInt(circle.id.slice(-1), 16) % 9) * 10;

                        return (
                            <Link key={circle.id} href={`/circles/${circle.id}/dashboard`}>
                                <div className="flex flex-col bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 active:scale-[0.98] transition-all group hover:border-[#F25F15]/30 overflow-hidden">

                                    {/* Cover Image Section */}
                                    <div className="relative h-32 w-full">
                                        {circle.coverImage ? (
                                            <img
                                                src={circle.coverImage}
                                                alt={circle.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#F25F15] via-[#FF8A50] to-[#FFB088]" />
                                        )}
                                        {/* Gradient overlay for text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                        {/* Status Badge - overlaid on image */}
                                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold capitalize backdrop-blur-sm ${circle.status === 'recruiting'
                                                ? 'bg-blue-500/80 text-white'
                                                : circle.status === 'active'
                                                    ? 'bg-emerald-500/80 text-white'
                                                    : 'bg-gray-500/80 text-white'
                                            }`}>
                                            {circle.status}
                                        </div>

                                        {/* Circle Name - overlaid on image */}
                                        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                                            <h3 className="font-extrabold text-white text-xl leading-tight drop-shadow-lg">
                                                {circle.name}
                                            </h3>
                                            {isAdmin && (
                                                <span className="material-symbols-outlined text-[18px] text-orange-300 drop-shadow" title="Admin">
                                                    verified_user
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-semibold text-text-sub dark:text-text-sub-dark capitalize">
                                                    {circle.frequency}
                                                </span>
                                                <span className="text-[10px] text-text-sub dark:text-text-sub-dark">•</span>
                                                <span className="text-sm font-bold text-[#F25F15]">
                                                    ${circle.amount}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-text-sub dark:text-text-sub-dark">
                                                <span className="material-symbols-outlined text-[14px]">group</span>
                                                <span className="font-medium">{circle.members?.length || 0} members</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="relative">
                                            <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#F25F15] rounded-full transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-[#F25F15]/10 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#F25F15]">
                            <span className="material-symbols-outlined text-4xl">groups</span>
                        </div>
                        <h3 className="font-exrabold text-text-main dark:text-white mb-2 text-xl">No circles yet</h3>
                        <p className="text-text-sub dark:text-text-sub-dark text-sm mb-8 max-w-[240px] leading-relaxed font-medium">
                            Join a circle to start saving with your community and build your reputation.
                        </p>
                        <Link href="/explore">
                            <button className="bg-[#F25F15] text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-orange-500/25 active:scale-95 transition-all text-sm tracking-wide">
                                Explore Circles
                            </button>
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
}
