import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-admin";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function AdminSupportCasePage(props: { params: Promise<{ id: string }> }) {
    await requireAdmin('read_only_analyst');
    const params = await props.params;

    const ticket = await prisma.supportCase.findUnique({
        where: { id: params.id },
        include: {
            createdBy: true,
            assignedTo: true
        }
    });

    if (!ticket) notFound();

    // Mock messages for MVP display since we stored them as JSON but schema could be richer later
    const messages = (ticket.messages as any[]) || [
        { id: 1, sender: ticket.createdBy, text: ticket.description, timestamp: ticket.createdAt }
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Link href="/admin/support" className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </Link>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{ticket.subject}</h2>
                            <span className="text-xs font-mono text-slate-400">#{ticket.caseId}</span>
                        </div>
                        <p className="text-slate-500 text-sm ml-9 capitalize">{ticket.category} • Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                        <button disabled className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-sm bg-white dark:bg-slate-800">
                            Close Ticket
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
                    {messages.map((msg: any) => (
                        <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.sender.id === ticket.createdBy.id ? '' : 'flex-row-reverse ml-auto'}`}>
                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative shrink-0">
                                {msg.sender.avatar && <Image src={msg.sender.avatar} alt="" fill className="object-cover" />}
                            </div>
                            <div className={`flex flex-col gap-1 ${msg.sender.id === ticket.createdBy.id ? 'items-start' : 'items-end'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{msg.sender.name}</span>
                                    <span className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender.id === ticket.createdBy.id
                                        ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                                        : 'bg-blue-600 text-white rounded-tr-none shadow-md'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Box */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto relative">
                        <textarea
                            placeholder="Type your reply..."
                            className="w-full p-4 pr-32 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                        ></textarea>
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg text-slate-600 hover:text-slate-900">
                                <span className="material-symbols-outlined">attach_file</span>
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                Send
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Context */}
            <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 space-y-8 overflow-y-auto">
                {/* Status Card */}
                <div>
                    <h3 className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-wider">Status</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-500">Priority</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${ticket.priority === 'high' || ticket.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                    ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {ticket.priority}
                            </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-500">Status</span>
                            <span className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-slate-200 text-slate-700">
                                {ticket.status}
                            </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-medium text-slate-500 block mb-2">Assigned To</span>
                            {ticket.assignedTo ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                        {ticket.assignedTo.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold">{ticket.assignedTo.name}</span>
                                </div>
                            ) : (
                                <button className="text-blue-600 text-xs font-bold hover:underline">Assign to me</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Context */}
                <div>
                    <h3 className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-wider">Related Context</h3>
                    {ticket.relatedUserId && (
                        <Link href={`/admin/users/${ticket.relatedUserId}`} className="block p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">person</span>
                                <div>
                                    <span className="text-sm font-bold block text-slate-900 dark:text-white">View User Profile</span>
                                    <span className="text-xs text-slate-500">ID: {ticket.relatedUserId.slice(0, 8)}...</span>
                                </div>
                            </div>
                        </Link>
                    )}
                    {ticket.relatedCircleId && (
                        <Link href={`/admin/circles/${ticket.relatedCircleId}`} className="block p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">supervised_user_circle</span>
                                <div>
                                    <span className="text-sm font-bold block text-slate-900 dark:text-white">View Circle Config</span>
                                    <span className="text-xs text-slate-500">ID: {ticket.relatedCircleId.slice(0, 8)}...</span>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
