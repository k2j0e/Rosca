"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideNavProps {
    user?: {
        name: string;
        avatar: string | null;
    };
}

export default function SideNav({ user }: SideNavProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (pathname === path) return true;
        if (path === "/home" && pathname === "/") return true;
        return false;
    };

    const navItems = [
        { name: "Home", path: "/home", icon: "home" },
        { name: "Explore", path: "/explore", icon: "explore" },
        { name: "My Circles", path: "/my-circles", icon: "groups" },
        { name: "Create Circle", path: "/create/financials", icon: "add_circle" },
    ];

    const bottomItems = [
        { name: "Profile", path: "/profile", icon: "person" },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-gray-800 fixed left-0 top-0 z-40">
            {/* Brand Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <Link href="/home" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-lg">O</span>
                    </div>
                    <span className="text-xl font-black tracking-tight">Orbit</span>
                </Link>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} href={item.path}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-text-sub dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white"
                                }`}>
                                <span
                                    className="material-symbols-outlined text-xl"
                                    style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                >
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                {bottomItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} href={item.path}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-text-sub dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white"
                                }`}>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <span
                                        className="material-symbols-outlined text-xl"
                                        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                    >
                                        {item.icon}
                                    </span>
                                )}
                                <span className="text-sm">{user?.name || item.name}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* Help Link */}
                <Link href="/how-it-works">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-sub dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">help</span>
                        <span className="text-sm">How it Works</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
