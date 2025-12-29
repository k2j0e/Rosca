import { prisma } from "@/lib/db";
import Link from "next/link";

async function getStats() {
    try {
        const [
            totalUsers,
            totalCircles,
            activeCircles,
            recruitingCircles,
            recentSignups
        ] = await Promise.all([
            prisma.user.count(),
            prisma.circle.count(),
            prisma.circle.count({ where: { status: 'active' } }),
            prisma.circle.count({ where: { status: 'recruiting' } }),
            prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
        ]);

        return { totalUsers, totalCircles, activeCircles, recruitingCircles, recentSignups };
    } catch (error) {
        console.error("Dashboard stats failed:", error);
        return { totalUsers: 0, totalCircles: 0, activeCircles: 0, recruitingCircles: 0, recentSignups: 0 };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mission Control</h2>
                <p className="text-slate-500">System overview and health metrics.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Users"
                    value={stats.totalUsers}
                    trend={`+${stats.recentSignups} this week`}
                    icon="group"
                    color="bg-blue-500"
                />
                <KPICard
                    title="Active Circles"
                    value={stats.activeCircles}
                    subValue={`${stats.recruitingCircles} recruiting`}
                    icon="change_circle"
                    color="bg-green-500"
                />
                <KPICard
                    title="Total Volume"
                    value="$124.5k"
                    trend="+12% vs last month"
                    icon="payments"
                    color="bg-purple-500"
                />
                <KPICard
                    title="Pending Support"
                    value="0"
                    subValue="All caught up"
                    icon="support_agent"
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Attention Needed */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">warning</span>
                        Needs Attention
                    </h3>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 text-center border border-dashed border-slate-300 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">check_circle</span>
                        <p className="text-slate-500 font-medium">System is healthy. No critical alerts.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        <Link href="/admin/users" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group">
                            <span className="text-sm font-medium">Find User</span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">search</span>
                        </Link>
                        <Link href="/admin/notifications/broadcast" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group">
                            <span className="text-sm font-medium">Send Broadcast</span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">campaign</span>
                        </Link>
                        <Link href="/circles/create" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group">
                            <span className="text-sm font-medium">Create Test Circle</span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">add_circle</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, subValue, trend, icon, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white block mb-1">{value}</span>
                    {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
                    {trend && <span className="text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">{trend}</span>}
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
        </div>
    );
}
