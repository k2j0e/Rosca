import { prisma } from "@/lib/db";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-admin";
import Image from "next/image";

export default async function AdminSupportPage(props: { searchParams: Promise<{ q?: string }> }) {
    await requireAdmin('read_only_analyst');
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";

    const cases = await prisma.supportCase.findMany({
        where: {
            OR: [
                { subject: { contains: query, mode: 'insensitive' } },
                { caseId: { contains: query, mode: 'insensitive' } }
            ]
        },
        include: {
            createdBy: true,
            assignedTo: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support Inbox</h2>
                    <p className="text-slate-500">Manage user inquiries and disputes.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled title="Coming Soon">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Create Ticket
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Case ID</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Requester</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Assigned</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {cases.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                    #{ticket.caseId.slice(-6)}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                    {ticket.subject}
                                    <span className="block text-xs text-slate-400 capitalize">{ticket.category}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                                            {ticket.createdBy.avatar && <Image src={ticket.createdBy.avatar} alt="" fill className="object-cover" />}
                                        </div>
                                        <span className="text-xs font-medium">{ticket.createdBy.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${ticket.priority === 'high' || ticket.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                            ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 capitalize">
                                    {ticket.status}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {ticket.assignedTo ? ticket.assignedTo.name : <span className="text-slate-400 italic">Unassigned</span>}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/admin/support/${ticket.id}`} className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {cases.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-20 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-400">inbox</span>
                                    </div>
                                    <p className="text-slate-500 font-medium">No active support cases.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
