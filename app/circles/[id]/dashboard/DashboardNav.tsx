"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav({
    circleId,
    circleName,
    isAdmin,
    status
}: {
    circleId: string;
    circleName: string;
    isAdmin: boolean;
    status: 'recruiting' | 'active' | 'completed' | 'open'; // 'open' is legacy
}) {
    const pathname = usePathname();

    const isRecruiting = status === 'recruiting';

    const tabs = [
        { name: "Overview", path: `/circles/${circleId}/dashboard`, exact: true },
        { name: "Members", path: `/circles/${circleId}/dashboard/members`, exact: false },
        { name: "Ledger", path: `/circles/${circleId}/dashboard/transparency`, exact: false },
        { name: isRecruiting ? "Commitment 🔒" : "Commitment", path: `/circles/${circleId}/dashboard/commitment`, exact: false, disabled: isRecruiting },
    ];

    const isActive = (path: string, exact: boolean) => {
        if (exact) return pathname === path;
        return pathname.startsWith(path);
    };

    return (
        <div className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
            {/* Header */}
            <div className="px-4 h-14 flex items-center justify-between">
                <div className="w-10"></div>{/* Spacer for centering */}
                <h1 className="text-[17px] font-bold text-text-main dark:text-white tracking-tight truncate px-2 flex-1 text-center">
                    {circleName}
                </h1>
                <div className="flex items-center gap-1">
                    {isAdmin && (
                        <Link href={`/circles/${circleId}/admin`} className="p-2 text-text-sub dark:text-text-sub-dark hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-2xl">settings</span>
                        </Link>
                    )}
                    <Link href={`/circles/${circleId}`} className="p-2 -mr-2 text-text-sub dark:text-text-sub-dark hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-2xl">info</span>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex w-full">
                {tabs.map((tab) => {
                    const active = isActive(tab.path, tab.exact);
                    const disabled = tab.disabled;
                    return (
                        <Link
                            key={tab.path}
                            href={disabled ? '#' : tab.path}
                            className={`flex-1 pb-3 pt-2 text-sm text-center border-b-[3px] transition-colors ${active
                                ? "font-bold text-primary border-primary"
                                : disabled
                                    ? "font-medium text-gray-300 dark:text-gray-700 border-transparent cursor-not-allowed"
                                    : "font-semibold text-text-sub dark:text-text-sub-dark border-transparent hover:text-text-main dark:hover:text-white"
                                }`}
                            onClick={(e) => disabled && e.preventDefault()}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
