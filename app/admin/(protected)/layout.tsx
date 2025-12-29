import { requireAdmin } from "@/lib/auth-admin";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // 1. Enforce Role Protection
    const user = await requireAdmin('read_only_analyst');

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">all_inclusive</span>
                        ROSCA Admin
                    </h1>
                    <span className="text-xs text-slate-400 mt-1 block">Platform Control</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="flex flex-col px-2 gap-1">
                        <AdminNavLink href="/admin" icon="dashboard" label="Overview" />
                        <AdminNavLink href="/admin/circles" icon="supervised_user_circle" label="Circles" />
                        <AdminNavLink href="/admin/users" icon="group" label="Users" />
                        <AdminNavLink href="/admin/support" icon="support_agent" label="Support" badge={0} />
                        <AdminNavLink href="/admin/notifications" icon="campaign" label="Notifications" />
                        <div className="my-2 border-t border-slate-800 mx-2"></div>
                        <AdminNavLink href="/admin/audit" icon="history_edu" label="Audit Log" />
                        <AdminNavLink href="/admin/settings" icon="settings" label="Settings" />
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate">{user.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate">{user.role}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-w-0">
                {children}
            </main>
        </div>
    );
}

function AdminNavLink({ href, icon, label, badge }: { href: string, icon: string, label: string, badge?: number }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="material-symbols-outlined">{icon}</span>
            <span className="font-medium flex-1">{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </Link>
    );
}
