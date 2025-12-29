import { prisma } from "@/lib/db";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-admin";
import Image from "next/image";

export default async function AdminCirclesPage(props: { searchParams: Promise<{ q?: string }> }) {
    await requireAdmin('read_only_analyst');
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";

    const circles = await prisma.circle.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { id: { contains: query, mode: 'insensitive' } }
            ]
        },
        include: {
            admin: true,
            members: { select: { id: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Circles Directory</h2>
                    <p className="text-slate-500">Manage all circles on the platform.</p>
                </div>
                {/* Search Bar - simple form for MVP */}
                <form className="flex gap-2">
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Search circles..."
                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">Search</button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Circle Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Members</th>
                            <th className="px-6 py-4">Value</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {circles.map((circle) => (
                            <tr key={circle.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 overflow-hidden relative">
                                        {circle.coverImage && <Image src={circle.coverImage} alt="" fill className="object-cover" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{circle.name}</span>
                                        <span className="text-xs text-slate-400">ID: {circle.id.slice(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={circle.status} />
                                </td>
                                <td className="px-6 py-4">
                                    {circle.members.length} / {circle.maxMembers}
                                </td>
                                <td className="px-6 py-4">
                                    ${circle.payoutTotal.toLocaleString()}
                                    <span className="text-xs text-slate-400 block">{circle.frequency}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(circle.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/admin/circles/${circle.id}`} className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {circles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No circles found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'recruiting': 'bg-blue-100 text-blue-700',
        'active': 'bg-green-100 text-green-700',
        'completed': 'bg-gray-100 text-gray-700',
        'paused': 'bg-orange-100 text-orange-700',
    };
    return (
        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
}
