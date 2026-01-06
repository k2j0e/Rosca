
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { getCircleLedgerGrid } from "@/lib/ledger";

export default async function TransparencyPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const user = await getCurrentUser();
    if (!user) redirect('/signin');

    const grid = await getCircleLedgerGrid(params.id);
    if (!grid) notFound();

    // Calculate round stats
    const totalRounds = grid.rounds.length;
    const completedRounds = grid.rounds.filter(r =>
        Object.values(r.contributions).every(c => c.status === 'paid' || c.status === 'confirmed')
    ).length;

    return (
        <div className="px-4 py-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with Stats */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-main dark:text-white">Circle Ledger</h2>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        {completedRounds}/{totalRounds} Rounds
                    </div>
                </div>
                <p className="text-sm text-text-sub dark:text-text-sub-dark">
                    Transparent record of all contributions and payouts.
                </p>
            </div>

            {/* Main Ledger Grid */}
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs font-bold text-text-sub dark:text-text-sub-dark uppercase tracking-wider border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-4 py-3 sticky left-0 bg-gray-50 dark:bg-[#1A1A1A] z-10 border-r border-gray-100 dark:border-white/5">
                                    Round
                                </th>
                                {grid.members.map(m => (
                                    <th key={m.id} className="px-4 py-3 text-center min-w-[100px]">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url('${m.avatar}')` }}></div>
                                            <span className="truncate max-w-[80px]">{m.name.split(' ')[0]}</span>
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right bg-amber-50/50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-500 border-l border-gray-100 dark:border-white/5">
                                    Payout
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {grid.rounds.map((round, roundIdx) => {
                                const isRoundComplete = Object.values(round.contributions).every(
                                    c => c.status === 'paid' || c.status === 'confirmed'
                                );
                                return (
                                    <tr
                                        key={round.roundId}
                                        className={`transition-colors ${isRoundComplete ? 'bg-green-50/50 dark:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                    >
                                        {/* Round Column */}
                                        <td className={`px-4 py-3 font-bold sticky left-0 z-10 border-r border-gray-100 dark:border-white/5 ${isRoundComplete
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                : 'bg-white dark:bg-[#121212] text-text-main dark:text-white'
                                            }`}>
                                            <div className="flex items-center gap-1.5">
                                                #{round.roundId}
                                                {isRoundComplete && (
                                                    <span className="material-symbols-outlined text-[14px] text-green-500 animate-bounce">
                                                        celebration
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Member Columns */}
                                        {grid.members.map((member, memberIdx) => {
                                            const contribution = round.contributions[member.id];
                                            const isPaid = contribution && (contribution.status === 'paid' || contribution.status === 'confirmed');
                                            return (
                                                <td key={member.id} className="px-4 py-3 text-center">
                                                    {contribution ? (
                                                        <div className="flex justify-center">
                                                            {isPaid ? (
                                                                <div
                                                                    className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center transition-all hover:scale-110 animate-in zoom-in duration-300"
                                                                    title={`Paid: $${contribution.amount}`}
                                                                    style={{ animationDelay: `${memberIdx * 50}ms` }}
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">check</span>
                                                                </div>
                                                            ) : contribution.status === 'pending' ? (
                                                                <div
                                                                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-primary hover:text-primary transition-all cursor-pointer"
                                                                    title="Pending"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center animate-pulse"
                                                                    title="Late/Missing"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">priority_high</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* Payout Column */}
                                        <td className={`px-4 py-3 text-right font-medium border-l border-gray-100 dark:border-white/5 ${isRoundComplete
                                                ? 'bg-amber-100/50 dark:bg-amber-900/20'
                                                : 'bg-amber-50/30 dark:bg-amber-900/5'
                                            }`}>
                                            {round.payoutRecipient ? (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 ${isRoundComplete
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        {isRoundComplete ? 'check_circle' : 'savings'}
                                                    </span>
                                                    {round.payoutRecipient.name.split(' ')[0]}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-text-sub dark:text-text-sub-dark">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600 text-[12px]">check</span>
                    </div>
                    <span>Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-[12px]">schedule</span>
                    </div>
                    <span>Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-[14px]">celebration</span>
                    <span>Complete</span>
                </div>
            </div>

            <div className="text-center text-xs text-text-sub dark:text-text-sub-dark mt-2">
                <p>🔒 All records are immutable and cryptographically verifiable.</p>
            </div>
        </div>
    );
}
