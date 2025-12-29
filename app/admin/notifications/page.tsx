import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-admin";

export default async function AdminNotificationsPage() {
    await requireAdmin('read_only_analyst');

    // For MVP, just taking latest 100 system notifications.
    const notifications = await prisma.notificationLog.findMany({
        orderBy: { sentAt: 'desc' },
        take: 100,
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Notifications</h2>
                    <p className="text-slate-500">History of automated and manual alerts sent to users.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-sm">campaign</span>
                        Broadcast
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Recipient</th>
                            <th className="px-6 py-4">Channel</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {notifications.map((notif) => (
                            <tr key={notif.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">
                                    {new Date(notif.sentAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    {JSON.stringify(notif.audience)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${notif.type === 'broadcast' ? 'bg-green-100 text-green-700' :
                                        'bg-blue-100 text-blue-700'
                                        }`}>
                                        {notif.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 max-w-md truncate">
                                    {notif.body}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-slate-100 text-slate-600">
                                        Sent
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {notifications.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No notifications recorded log.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
