import { prisma } from "@/lib/db";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-admin";
import Image from "next/image";

export default async function AdminUsersPage(props: { searchParams: Promise<{ q?: string }> }) {
    await requireAdmin('read_only_analyst');
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { phoneNumber: { contains: query, mode: 'insensitive' } },
                { id: { contains: query, mode: 'insensitive' } }
            ]
        },
        include: {
            _count: {
                select: { memberships: true, createdCircles: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Directory</h2>
                    <p className="text-slate-500">Manage platform users and permissions.</p>
                </div>
                <form className="flex gap-2">
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Name, Phone, ID..."
                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">Search</button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Trust Score</th>
                            <th className="px-6 py-4">Circles</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative">
                                        {user.avatar && <Image src={user.avatar} alt="" fill className="object-cover" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{user.name}</span>
                                        <span className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.phoneNumber}
                                    <span className="block text-xs text-slate-400">{user.location}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${user.trustScore > 800 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {user.trustScore}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user._count.memberships} Joined • {user._count.createdCircles} Created
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${user.role === 'platform_admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full">
                                        View Profile
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
