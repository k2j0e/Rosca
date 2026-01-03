"use strict";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getCircles } from "@/lib/data";
import { ExplainRoscaTrigger } from "@/app/components/ExplainRosca";
import { CircleCard } from "@/app/components/CircleCard";

export default async function ExploreCircles(props: { searchParams: Promise<{ joined?: string }> }) {
    const searchParams = await props.searchParams;
    const joined = searchParams?.joined === 'true';
    const circles = (await getCircles()).filter(c => !c.isPrivate);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark shadow-2xl pb-20 lg:pb-8">
            {/* Success Toast */}
            {joined && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500 w-[90%] max-w-sm">
                    <div className="bg-green-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="bg-white/20 p-1 rounded-full">
                            <span className="material-symbols-outlined text-xl">check</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Request Sent</span>
                            <span className="text-xs text-white/90">Your join request is pending approval.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Top App Bar */}
            <div className="flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 pb-0 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <p className="text-text-main dark:text-text-main-dark tracking-tight text-[28px] font-bold leading-tight">
                        Explore Circles
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="text-text-main dark:text-text-main-dark transition-colors hover:text-primary p-1">
                            <span className="material-symbols-outlined text-2xl">
                                notifications
                            </span>
                        </button>
                        <ExplainRoscaTrigger variant="icon" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3 sticky top-[90px] z-10 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm">
                <label className="flex flex-col h-12 w-full shadow-sm rounded-xl">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700">
                        <div
                            className="text-text-sub dark:text-text-sub-dark flex border-none items-center justify-center pl-4 rounded-l-xl"
                            data-icon="MagnifyingGlass"
                        >
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main dark:text-text-main-dark focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-text-sub dark:placeholder:text-text-sub-dark px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                            placeholder="Try 'Travel' or 'Under $200'"
                            defaultValue=""
                        />
                        <div className="text-primary flex border-none items-center justify-center pr-4 rounded-r-xl cursor-pointer">
                            <span className="material-symbols-outlined">tune</span>
                        </div>
                    </div>
                </label>
            </div>

            {/* Filter Chips (Horizontal Scroll) */}
            <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
                <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 pl-3 pr-3 shadow-sm active:scale-95 transition-transform">
                    <p className="text-text-main dark:text-text-main-dark text-sm font-medium leading-normal">
                        Budget
                    </p>
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                </button>
                <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white pl-3 pr-3 shadow-md shadow-primary/20 active:scale-95 transition-transform">
                    <p className="text-sm font-medium leading-normal">Duration</p>
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
                <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 pl-3 pr-3 shadow-sm active:scale-95 transition-transform">
                    <p className="text-text-main dark:text-text-main-dark text-sm font-medium leading-normal">
                        Short-term
                    </p>
                </button>
                <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 pl-3 pr-3 shadow-sm active:scale-95 transition-transform">
                    <p className="text-text-main dark:text-text-main-dark text-sm font-medium leading-normal">
                        Emergency
                    </p>
                </button>
                <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 pl-3 pr-3 shadow-sm active:scale-95 transition-transform">
                    <p className="text-text-main dark:text-text-main-dark text-sm font-medium leading-normal">
                        Business
                    </p>
                </button>
            </div>

            {/* Main Content: Circles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 pb-6">
                {circles.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} />
                ))}

                {/* Create New Circle Button */}
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <Link href="/create/financials">
                        <button className="flex items-center gap-2 px-4 py-2 bg-text-main dark:bg-white text-white dark:text-text-main rounded-full text-sm font-bold shadow-md">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Create New Circle
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
