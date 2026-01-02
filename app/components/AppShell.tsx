"use client";

import SideNav from "./SideNav";
import BottomNav from "./BottomNav";

interface AppShellProps {
    children: React.ReactNode;
    user?: {
        name: string;
        avatar: string | null;
    };
}

/**
 * AppShell provides the main layout structure:
 * - Mobile: Content + BottomNav
 * - Desktop (lg:): SideNav + Content
 */
export default function AppShell({ children, user }: AppShellProps) {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Desktop Sidebar */}
            <SideNav user={user} />

            {/* Main Content Area */}
            <main className="lg:ml-64 min-h-screen">
                {/* Content Container - wider on desktop */}
                <div className="max-w-md lg:max-w-4xl xl:max-w-5xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav - hidden on desktop */}
            <div className="lg:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
