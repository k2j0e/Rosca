"use strict";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const hiddenPathPrefixes = ['/onboarding', '/admin', '/signin', '/signup', '/invite'];
    if (hiddenPathPrefixes.some(prefix => pathname.startsWith(prefix))) return null;

    const isActive = (path: string) => {
        if (pathname === path) return true;
        if (path === "/home" && pathname === "/") return true;
        return false;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-surface-dark/85 backdrop-blur-md border-t border-gray-200/50 dark:border-white/5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
            <ul className="flex justify-around items-end max-w-lg mx-auto px-6 h-full">
                <li className="flex-1">
                    <Link href="/home" className="flex flex-col items-center gap-1 group w-full">
                        <div className="relative p-1">
                            <span className={`material-symbols-outlined text-[26px] transition-transform group-active:scale-90 ${isActive('/home') ? 'text-primary filled font-bold' : 'text-text-muted group-hover:text-text-main dark:text-text-sub-dark dark:group-hover:text-white'}`}>
                                home
                            </span>
                            {isActive('/home') && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full"></span>}
                        </div>
                        <span className={`text-[10px] font-bold ${isActive('/home') ? 'text-primary' : 'text-text-muted dark:text-text-sub-dark'}`}>Home</span>
                    </Link>
                </li>
                <li className="flex-1">
                    <Link href="/explore" className="flex flex-col items-center gap-1 group w-full">
                        <span className={`material-symbols-outlined text-[26px] transition-colors group-active:scale-90 ${isActive('/explore') ? 'text-primary filled font-bold' : 'text-text-muted group-hover:text-text-main dark:text-text-sub-dark dark:group-hover:text-white'}`}>
                            travel_explore
                        </span>
                        <span className={`text-[10px] font-medium ${isActive('/explore') ? 'text-primary font-bold' : 'text-text-muted dark:text-text-sub-dark'}`}>Explore</span>
                    </Link>
                </li>

                <li className="flex-1 relative -top-5 flex justify-center">
                    <Link href="/create/financials">
                        <button className="w-14 h-14 bg-text-main dark:bg-primary text-white rounded-full shadow-glow flex items-center justify-center active:scale-95 transition-transform hover:bg-black dark:hover:bg-primary-hover border-4 border-background-light dark:border-background-dark">
                            <span className="material-symbols-outlined text-2xl">add</span>
                        </button>
                    </Link>
                </li>

                <li className="flex-1">
                    <Link href="/my-circles" className="flex flex-col items-center gap-1 group w-full">
                        <span className={`material-symbols-outlined text-[26px] transition-colors group-active:scale-90 ${isActive('/my-circles') ? 'text-primary filled font-bold' : 'text-text-muted group-hover:text-text-main dark:text-text-sub-dark dark:group-hover:text-white'}`}>
                            groups
                        </span>
                        <span className={`text-[10px] font-medium ${isActive('/my-circles') ? 'text-primary font-bold' : 'text-text-muted dark:text-text-sub-dark'}`}>Circles</span>
                    </Link>
                </li>
                <li className="flex-1">
                    <Link href="/profile" className="flex flex-col items-center gap-1 group w-full">
                        <span className={`material-symbols-outlined text-[26px] transition-colors group-active:scale-90 ${isActive('/profile') ? 'text-primary filled font-bold' : 'text-text-muted group-hover:text-text-main dark:text-text-sub-dark dark:group-hover:text-white'}`}>
                            person
                        </span>
                        <span className={`text-[10px] font-medium ${isActive('/profile') ? 'text-primary font-bold' : 'text-text-muted dark:text-text-sub-dark'}`}>Profile</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
