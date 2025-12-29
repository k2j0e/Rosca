"use strict";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    // Exclude BottomNav on specific full-screen flows
    const hiddenPaths = ['/welcome', '/signin', '/signup', '/admin'];
    // Also hide if we are in the create flow? Maybe the user wants it everywhere. 
    // Let's stick to the obvious auth/welcome pages for now.
    // If exact match or starts with (for nested routes if needed, though exact check is safer for known routes)
    // Actually, simple includes check for root paths is fine.
    if (hiddenPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) return null;

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true; // Keep active state logic
        return false; // For other pages, no tab is active, but nav is visible
    };

    const navItems = [
        { name: "Home", path: "/", icon: "home" },
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
                                        className={`material-symbols-outlined text-2xl ${active ? "font-variation-settings-fill" : ""
                                            }`}
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
