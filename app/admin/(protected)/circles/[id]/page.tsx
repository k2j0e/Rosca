import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-admin";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AdminCircleControls from "./AdminCircleControls";

export default async function AdminCircleDetailPage(props: { params: Promise<{ id: string }> }) {
    await requireAdmin('read_only_analyst');
    const params = await props.params;

    const circle = await prisma.circle.findUnique({
        where: { id: params.id },
        include: {
            admin: true,
            members: { include: { user: true } },
            events: { orderBy: { timestamp: 'desc' }, take: 10 }
        }
    });

    if (!circle) notFound();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <Link href="/admin/circles" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{circle.name}</h2>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-blue-100 text-blue-700`}>
                                {circle.status}
                            </span>
                        </div>
                        <p className="text-slate-500">ID: {circle.id} • Created by <Link href={`/admin/users/${circle.adminId}`} className="text-blue-600 hover:underline">{circle.admin.name}</Link></p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <AdminCircleControls circleId={circle.id} isFrozen={circle.isFrozen} />
                    <Link href={`/circles/${circle.id}`} target="_blank" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-slate-800">
                        View Public Page
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Config */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Config Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-lg mb-4">Configuration</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <Stat label="Total Pot" value={`$${circle.payoutTotal.toLocaleString()}`} />
                            <Stat label="Contribution" value={`$${circle.amount.toLocaleString()}`} />
                            <Stat label="Frequency" value={circle.frequency} capitalize />
                            <Stat label="Members" value={`${circle.members.length} / ${circle.maxMembers}`} />
                        </div>
                    </div>

                    {/* Member List */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Members</h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                {circle.members.length} Members
                            </span>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payout Month</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {circle.members.map(member => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative">
                                                {member.user.avatar && <Image src={member.user.avatar} alt="" fill className="object-cover" />}
                                            </div>
                                            <Link href={`/admin/users/${member.userId}`} className="font-medium hover:text-blue-600">
                                                {member.user.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 capitalize text-slate-500">{member.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${member.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                member.status === 'late' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">Month {member.payoutMonth || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Events & Risk */}
                <div className="space-y-8">
                    {/* Risk Score (Mock) */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-lg mb-4">Health Check</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center text-2xl font-bold text-green-600">
                                A
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Excellent Condition</p>
                                <p className="text-sm text-slate-500">All payments on time.</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-lg mb-4">Recent Events</h3>
                        <div className="space-y-6 relative border-l-2 border-slate-100 dark:border-slate-700 ml-2 pl-6">
                            {circle.events.map(event => (
                                <div key={event.id} className="relative">
                                    <div className="absolute -left-[29px] top-1 px-1 bg-white dark:bg-slate-800">
                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{event.message}</p>
                                    <p className="text-xs text-slate-500 max-w-[200px] truncate">{event.type} • {new Date(event.timestamp).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value, capitalize }: { label: string, value: string | number, capitalize?: boolean }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">{label}</p>
            <p className={`text-lg font-bold text-slate-900 dark:text-white ${capitalize ? 'capitalize' : ''}`}>{value}</p>
        </div>
    );
}
