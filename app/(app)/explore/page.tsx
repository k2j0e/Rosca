"use strict";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getCircles } from "@/lib/data";
import { CircleCard } from "@/app/components/CircleCard";

export default async function ExploreCircles(props: { searchParams: Promise<{ joined?: string }> }) {
    const searchParams = await props.searchParams;
    const joined = searchParams?.joined === 'true';
    const circles = (await getCircles()).filter(c => !c.isPrivate);

    return (
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-28 font-display">
            {/* Header */}
            <header className="pt-14 px-6 pb-2 sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-text-muted text-sm font-medium tracking-wide mb-0.5">Community</span>
                        <h1 className="text-3xl font-bold text-text-main dark:text-white">Explore Circles</h1>
                    </div>
                </div>
            </header>

            {/* Search & Filters */}
            <div className="px-6 py-4 sticky top-[80px] z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm space-y-4">
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl text-text-main dark:text-white placeholder-text-muted transition-all shadow-sm group-hover:shadow-md"
                        placeholder="Search by goal, amount, or host..."
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex-none px-5 py-2.5 rounded-full bg-text-main dark:bg-white text-white dark:text-text-main font-bold text-sm shadow-md transition-transform active:scale-95">
                        All
                    </button>
                    <button className="flex-none px-5 py-2.5 rounded-full bg-surface-light dark:bg-surface-dark text-text-sub dark:text-text-sub-dark font-semibold text-sm border border-gray-200 dark:border-white/10 shadow-sm whitespace-nowrap transition-all active:scale-95 hover:border-primary/50 hover:text-primary">
                        Amount
                    </button>
                    <button className="flex-none px-5 py-2.5 rounded-full bg-surface-light dark:bg-surface-dark text-text-sub dark:text-text-sub-dark font-semibold text-sm border border-gray-200 dark:border-white/10 shadow-sm whitespace-nowrap transition-all active:scale-95 hover:border-primary/50 hover:text-primary">
                        Cadence
                    </button>
                    <button className="flex-none px-5 py-2.5 rounded-full bg-surface-light dark:bg-surface-dark text-text-sub dark:text-text-sub-dark font-semibold text-sm border border-gray-200 dark:border-white/10 shadow-sm whitespace-nowrap transition-all active:scale-95 hover:border-primary/50 hover:text-primary">
                        Duration
                    </button>
                    <button className="flex-none px-5 py-2.5 rounded-full bg-surface-light dark:bg-surface-dark text-text-sub dark:text-text-sub-dark font-semibold text-sm border border-gray-200 dark:border-white/10 shadow-sm whitespace-nowrap transition-all active:scale-95 hover:border-primary/50 hover:text-primary">
                        Travel
                    </button>
                </div>
            </div>

            {/* Success Toast */}
            {joined && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500 w-[90%] max-w-sm">
                    <div className="bg-emerald-500 text-white px-5 py-4 rounded-3xl shadow-glow flex items-center gap-4 border border-white/20 backdrop-blur-md">
                        <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">check</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">Request Submitted</span>
                            <span className="text-xs text-white/90 font-medium">Sit tight! We've notified the host.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content: Circles List */}
            <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {circles.map((circle) => (
                        <div key={circle.id} className="h-full">
                            <CircleCard circle={circle} />
                        </div>
                    ))}
                </div>

                {/* Empty State / CTA */}
                {circles.length < 3 && (
                    <div className="mt-12 mb-6 p-8 rounded-[2rem] bg-gradient-to-br from-primary/5 to-orange-100 dark:from-primary/10 dark:to-orange-900/10 border-2 border-dashed border-primary/20 text-center relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-4xl text-primary">add_circle</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Don't see the perfect circle?</h3>
                            <Link href="/create/financials">
                                <button className="mt-2 px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-glow hover:shadow-lg transition-all active:scale-95 hover:bg-primary-hover">
                                    Start Your Own
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-6"></div>
        </div>
    );
}
