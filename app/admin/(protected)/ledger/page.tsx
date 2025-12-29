import { requireAdmin } from "@/lib/auth-admin";
import { getLedgerHistory } from "@/lib/ledger";
import Link from "next/link";

export default async function LedgerExplorerPage() {
    await requireAdmin('read_only_analyst');
    const entries = await getLedgerHistory({ limit: 100 });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ledger Explorer</h1>
                    <p className="text-gray-500 dark:text-gray-400">Immutable record of all financial & state events.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition">
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Context</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                                        {entry.createdAt.toISOString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${entry.type.includes('OBLIGATION') ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800' :
                                                entry.type.includes('PAID') ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                                                    entry.type.includes('MEMBER') ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                                                        'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                            }`}>
                                            {entry.type.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {entry.description}
                                        {entry.status === 'VOIDED' && (
                                            <span className="ml-2 text-red-500 text-xs font-bold uppercase">(Voided)</span>
                                        )}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono font-bold ${entry.direction === 'CREDIT' ? 'text-green-600 dark:text-green-400' :
                                            entry.direction === 'DEBIT' ? 'text-red-600 dark:text-red-400' :
                                                'text-gray-400'
                                        }`}>
                                        {entry.amount ? (
                                            <>
                                                {entry.direction === 'DEBIT' ? '-' : '+'}
                                                ${entry.amount.toLocaleString()}
                                            </>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            {entry.admin ? (
                                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Admin: {entry.admin.name}</span>
                                            ) : entry.user ? (
                                                <span className="text-gray-700 dark:text-gray-300">{entry.user.name}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">System</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.circleId && (
                                            <Link
                                                href={`/admin/circles/${entry.circleId}`}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Circle:{entry.circleId.substring(0, 8)}...
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {entries.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No ledger entries found. Perform some actions to populate the ledger.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
