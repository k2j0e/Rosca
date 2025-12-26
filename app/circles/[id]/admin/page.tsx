"use strict";

import Link from "next/link";

export default async function AdminDashboard(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display">
            {/* TopAppBar */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <Link href={`/circles/${params.id}/dashboard`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Admin Tools
                </h2>
                <div className="w-12"></div>
            </div>

            <div className="px-6 py-4">
                <h1 className="text-2xl font-bold mb-1">Manage Circle</h1>
                <p className="text-text-sub dark:text-text-sub-dark text-sm">
                    Overview and settings for "Family Vacation Fund"
                </p>
            </div>

            {/* Main Actions */}
            <div className="flex flex-col gap-4 px-4 pb-8">
                {/* Payout Management Card */}
                <Link href={`/circles/${params.id}/admin/payouts`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 transition-colors">
                            <span className="material-symbols-outlined text-[24px]">
                                reorder
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold leading-tight">
                                Payout Schedule
                            </h3>
                            <p className="text-sm text-text-sub dark:text-text-sub-dark mt-0.5">
                                Assign slots and reorder members.
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                            arrow_forward_ios
                        </span>
                    </div>
                </Link>

                {/* Member Management Card */}
                <Link href={`/circles/${params.id}/admin/members`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 transition-colors">
                            <span className="material-symbols-outlined text-[24px]">
                                group
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold leading-tight">
                                Manage Members
                            </h3>
                            <p className="text-sm text-text-sub dark:text-text-sub-dark mt-0.5">
                                Approve requests and remove members.
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                            arrow_forward_ios
                        </span>
                    </div>
                </Link>

                {/* Global Settings Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 opacity-70 cursor-not-allowed">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[24px]">
                            settings
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold leading-tight">
                            Circle Settings
                        </h3>
                        <p className="text-sm text-text-sub dark:text-text-sub-dark mt-0.5">
                            Edit name, rules, and privacy.
                        </p>
                    </div>
                </div>
            </div>

            {/* Health Overview */}
            <div className="px-4 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3 px-2">
                    Circle Health
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">On-Time Rate</p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">100%</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold text-text-sub dark:text-text-sub-dark uppercase">Pending</p>
                        <p className="text-2xl font-bold text-text-main dark:text-white">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
