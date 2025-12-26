"use strict";

import Link from "next/link";
import { getCircles } from "@/lib/data";

export default async function ExploreCircles(props: { searchParams: Promise<{ joined?: string }> }) {
    const searchParams = await props.searchParams;
    const joined = searchParams?.joined === 'true';
    const circles = getCircles();

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl pb-20">
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
                <div className="flex items-center h-12 justify-between">
                    <div className="flex items-center gap-2">
                        {/* Brand/Logo Placeholder could go here */}
                    </div>
                    <div className="flex gap-4">
                        <button className="text-text-main dark:text-text-main-dark transition-colors hover:text-primary">
                            <span className="material-symbols-outlined text-3xl">
                                notifications
                            </span>
                        </button>
                    </div>
                </div>
                <p className="text-text-main dark:text-text-main-dark tracking-tight text-[28px] font-bold leading-tight">
                    Explore Circles
                </p>
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
            <div className="flex flex-col gap-5 p-4 pb-6">
                {circles.map((circle) => (
                    <Link key={circle.id} href={`/circles/${circle.id}`}>
                        <div className="flex flex-col rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-surface-light dark:bg-surface-dark overflow-hidden border border-gray-100 dark:border-gray-800 group transition-all hover:shadow-md cursor-pointer">
                            {/* Conditional Rendering based on Category for Visual Variety */}
                            {circle.category === 'Business' ? (
                                <div className="relative w-full h-32 bg-gray-200 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        data-alt="Modern office desk"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOWuRL4fRh-As6rzLJLR-bTxGhkP7tsdxrZdQelyBtrAwNlZt_uYDY1JRvDVD6XSlXnNw93_sRve3f708CaXFgSLafwrzhui36Mw56V3n5KcOx5OT6M_HK__XjChFEVqTpnQ_ASwNPHUMIhJcQjvr9YK5qWinZneQCoMnDb6FwmPR2lXDRktDZKcO4F1ECPOemAOkHqzs7oCvRfTNC-C9f1kw-EL8omCS-ZYI95SyfPDKGhZi4a-HVcRSWBTNBXNpQ8nZXF--KBl0F")',
                                        }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-4 flex gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-white/90 dark:bg-black/80 px-2 py-0.5 text-xs font-semibold text-text-main dark:text-white backdrop-blur-md">
                                            <span className="material-symbols-outlined text-[14px]">
                                                storefront
                                            </span>
                                            {circle.category}
                                        </span>
                                    </div>
                                </div>
                            ) : circle.category === 'Travel' ? (
                                <div className="flex p-4 gap-4 items-start border-b border-gray-50 dark:border-gray-800/50">
                                    <div className="w-20 h-20 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <span className="material-symbols-outlined text-4xl">flight_takeoff</span>
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="flex justify-between items-start">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
                                                {circle.category}
                                            </span>
                                            <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Open
                                            </span>
                                        </div>
                                        <h3 className="text-text-main dark:text-text-main-dark text-lg font-bold leading-tight">
                                            {circle.name}
                                        </h3>
                                        <p className="text-text-sub dark:text-text-sub-dark text-sm line-clamp-1">
                                            {circle.description}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-24 bg-gray-200 overflow-hidden">
                                    <div className="absolute inset-0 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-[2px]"></div>
                                    <div className="absolute inset-0 flex items-center px-4">
                                        <div className="flex flex-col">
                                            <span className="inline-flex w-fit items-center gap-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 text-xs font-semibold backdrop-blur-md mb-1">
                                                <span className="material-symbols-outlined text-[14px]">savings</span>
                                                {circle.category}
                                            </span>
                                            <h3 className="text-text-main dark:text-text-main-dark text-lg font-bold leading-tight">
                                                {circle.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Common Footer Content */}
                            <div className="flex flex-col p-4 gap-3 pt-2">
                                {circle.category === 'Business' && (
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-text-main dark:text-text-main-dark text-lg font-bold leading-tight">
                                                {circle.name}
                                            </h3>
                                            <span className="text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full text-xs font-bold">
                                                {Math.max(0, circle.maxMembers - circle.members.length)} Spots Left
                                            </span>
                                        </div>
                                        <p className="text-text-sub dark:text-text-sub-dark text-sm">
                                            Starts {new Date(circle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {circle.frequency}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-baseline gap-2 mt-1">
                                    <div className="flex flex-col">
                                        <span className="text-text-sub text-xs">Contribution</span>
                                        <span className="text-text-main dark:text-text-main-dark font-bold text-lg">
                                            ${circle.amount}
                                        </span>
                                    </div>
                                    <span className="text-text-sub text-sm self-end">/ {circle.frequency} • {circle.duration} Rounds</span>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {circle.members.slice(0, 3).map((m, i) => (
                                                <div
                                                    key={i}
                                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-200 bg-cover bg-center"
                                                    style={{ backgroundImage: `url("${m.avatar}")` }}
                                                ></div>
                                            ))}
                                            {circle.members.length > 3 && (
                                                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-300 flex items-center justify-center text-[10px] font-bold text-text-sub">
                                                    +{circle.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-text-sub">{circle.members.length} joined</span>
                                    </div>
                                    <span className="text-primary font-semibold text-sm">View Details</span>
                                </div>
                            </div>
                        </div>
                    </Link>
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
