import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-admin";
import Link from "next/link";

export default async function AdminAuditPage() {
    await requireAdmin('read_only_analyst');

    // This table might get huge, so in a real app offset-pagination is critical.
    // For MVP, just taking latest 100.
    const logs = await prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
        include: {
            admin: true
        }
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Log</h2>
                    <p className="text-slate-500">Security trail of all administrative actions.</p>
                </div>
                <div className="flex gap-2">
                    <button className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Admin</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Target</th>
                            <th className="px-6 py-4">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/admin/users/${log.adminId}`} className="font-bold hover:underline">
                                        {log.admin.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    <span className="uppercase font-bold text-slate-400 mr-2">{log.targetType}</span>
                                    <span className="font-mono">{log.targetId}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 italic">
                                    {log.reason || '-'}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No actions recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
