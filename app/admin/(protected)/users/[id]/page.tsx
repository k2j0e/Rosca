import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-admin";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
    await requireAdmin('read_only_analyst');
    const params = await props.params;

    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            memberships: { include: { circle: true } },
            createdCircles: true,
            supportCasesCreated: true
        }
    });

    if (!user) notFound();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden relative border-4 border-white dark:border-slate-800 shadow-sm">
                            {user.avatar && <Image src={user.avatar} alt="" fill className="object-cover" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${user.role === 'platform_admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <p className="text-slate-500">{user.phoneNumber} • {user.location}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button disabled className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-bold rounded-lg disabled:opacity-50 cursor-not-allowed hover:bg-red-100">
                        Disable Account
                    </button>
                    <button disabled className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold rounded-lg disabled:opacity-50 cursor-not-allowed">
                        Reset Password
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Overview & Stats */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-lg mb-4">Reputation</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-slate-500 font-medium">Trust Score</span>
                                    <span className="font-bold text-lg text-green-600">{user.trustScore}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${Math.min(user.trustScore / 10, 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <span className="text-xs uppercase text-slate-400 font-bold">Joined</span>
                                    <p className="font-bold">{user.memberSince}</p>
                                </div>
                                <div>
                                    <span className="text-xs uppercase text-slate-400 font-bold">Badges</span>
                                    <div className="flex gap-1 mt-1">
                                        {user.badges.length > 0 ? (
                                            user.badges.map(b => (
                                                <span key={b} className="w-2 h-2 rounded-full bg-blue-500" title={b}></span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400">-</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Circles */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-lg">Circle Memberships</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Circle</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {user.memberships.map(m => (
                                    <tr key={m.id}>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/circles/${m.circleId}`} className="font-medium hover:text-blue-600">
                                                {m.circle.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 capitalize text-slate-500">{m.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${m.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    m.status === 'late' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(m.joinedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {user.memberships.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                            No memberships found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
