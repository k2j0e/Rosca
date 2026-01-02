"use strict";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    // BottomNav is now only rendered inside (app) layout, so simpler check.
    // Still hide on admin and onboarding.
    const hiddenPathPrefixes = ['/onboarding', '/admin'];
    if (hiddenPathPrefixes.some(prefix => pathname.startsWith(prefix))) return null;

    const isActive = (path: string) => {
        // Exact match for main nav paths
        if (pathname === path) return true;
        // For /home, also match root app route
        if (path === "/home" && pathname === "/") return true;
        return false;
    };

    const navItems = [
        { name: "Home", path: "/home", icon: "home" },
        { name: "Explore", path: "/explore", icon: "explore" },
        { name: "My Circles", path: "/my-circles", icon: "groups" },
        { name: "Profile", path: "/profile", icon: "person" },
    ];

    return (
        <>
            {/* Spacer to prevent content overlap */}
            <div className="h-20 w-full" aria-hidden="true" />

            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
                <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link key={item.path} href={item.path} className="w-full h-full">
                                <button
                                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active
                                        ? "text-primary"
                                        : "text-text-sub dark:text-text-sub-dark hover:text-primary"
                                        }`}
                                >
                                    <span
                                        className={`material-symbols-outlined text-2xl`}
                                        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="text-[10px] font-medium">{item.name}</span>
                                </button>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
