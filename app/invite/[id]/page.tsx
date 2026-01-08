import Link from "next/link";
import { notFound } from "next/navigation";
import { getCircle } from "@/lib/data";
import { Logo } from "@/app/components/Logo";

export default async function InvitePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    console.log('[DEBUG] Invite Page params:', params);
    const circle = await getCircle(params.id);
    console.log('[DEBUG] Invite Page circle found:', !!circle, circle?.id);

    if (!circle) {
        console.log('[DEBUG] Invite Page: Circle not found, returning 404');
        return notFound();
    }

    // Safe Admin Logic
    const admin = circle.members.find(m => m.role === 'admin');
    console.log('[DEBUG] Circle data:', JSON.stringify({ ...circle, members: circle.members.length }, null, 2));

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">
            {/* Header */}
            <div className="p-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-text-main dark:text-white">
                    <Logo size="md" variant="outline" />
                    <span>Circle8<span className="text-primary">.</span></span>
                </Link>
                <Link href="/signin">
                    <span className="text-sm font-bold text-text-main dark:text-white hover:opacity-70">Sign In</span>
                </Link>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full">

                {/* Visual Avatar/Icon */}
                <div className="mb-8 relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white shadow-xl shadow-primary/30 overflow-hidden border-4 border-white dark:border-background-dark">
                        {admin?.avatar ? (
                            <img src={admin.avatar} alt={admin.name || 'Admin'} className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-[48px]">groups</span>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-black p-2 rounded-full">
                        <span className="material-symbols-outlined text-green-500 text-2xl">verified</span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white mb-4 leading-tight">
                    You've been invited to join<br />
                    <span className="text-primary">{circle.name}</span>
                </h1>

                <p className="text-lg text-text-sub dark:text-text-sub-dark mb-10 leading-relaxed">
                    A savings circle organized by <strong>{circle.members.find(m => m.role === 'admin')?.name || 'a friend'}</strong>.
                </p>

                {/* Circle Snapshot */}
                <div className="w-full bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5 mb-8">
                    <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-white/10">
                        <div className="flex flex-col gap-1 pb-4">
                            <span className="text-xs uppercase font-bold text-text-sub dark:text-text-sub-dark tracking-wide">Contribution</span>
                            <span className="text-3xl font-black text-text-main dark:text-white">${circle.amount}</span>
                            <span className="text-xs text-text-sub dark:text-text-sub-dark">{circle.frequency}</span>
                        </div>
                        <div className="flex flex-col gap-1 pb-4">
                            <span className="text-xs uppercase font-bold text-text-sub dark:text-text-sub-dark tracking-wide">Payout</span>
                            <span className="text-3xl font-black text-primary">${circle.payoutTotal.toLocaleString()}</span>
                            <span className="text-xs text-text-sub dark:text-text-sub-dark">Lump Sum</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-white/10 pt-4 mt-2">
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full">
                                <span className="material-symbols-outlined text-xl">info</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-text-sub dark:text-text-sub-dark leading-snug">
                                    Members pool money together and take turns receiving the full amount. No interest, just community support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-4">
                    <Link href={`/invite/${circle.id}/tutorial`} className="block w-full">
                        <button className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:scale-[1.02] shadow-xl shadow-primary/25 transition-all">
                            Check it out
                        </button>
                    </Link>

                    <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="text-xs text-text-sub dark:text-text-sub-dark">
                            New to Circle8? You'll create a free account to join.
                        </p>

                        <Link href={`/signin?redirect=${encodeURIComponent(`/circles/${circle.id}/join`)}`}>
                            <button className="text-primary font-bold text-sm hover:underline">
                                Already have an account? Sign In
                            </button>
                        </Link>
                    </div>
                </div>

            </main>

            {/* Micro Explainer Footer */}
            <div className="bg-gray-50 dark:bg-white/5 py-8 border-t border-gray-200 dark:border-white/5">
                <div className="max-w-md mx-auto px-6 grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">lock</span>
                        <span className="text-xs font-bold text-text-sub dark:text-text-sub-dark">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">percent</span>
                        <span className="text-xs font-bold text-text-sub dark:text-text-sub-dark">0% Interest</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">verified_user</span>
                        <span className="text-xs font-bold text-text-sub dark:text-text-sub-dark">Vetted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
