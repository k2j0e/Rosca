"use strict";


import { notFound } from "next/navigation";
import { getCircle, getCurrentUser } from "@/lib/data";
import InviteButton from "@/app/components/InviteButton";
import { updateMemberStatusAction, verifyPaymentAction } from "@/app/actions";

export default async function DashboardMembers(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = getCircle(params.id);
    const currentUser = getCurrentUser();

    if (!circle) {
        notFound();
    }

    // Sort members: Payout Month first, then Admin, then Name
    const sortedMembers = [...circle.members].sort((a, b) => {
        // If payout months are set, standard members logic
        if (a.payoutMonth && b.payoutMonth) return a.payoutMonth - b.payoutMonth;
        if (a.payoutMonth) return -1;
        if (b.payoutMonth) return 1;

        // Fallback
        if (a.role === 'admin') return -1;
        if (b.role === 'admin') return 1;
        return a.name.localeCompare(b.name);
    });

    const currentUserMember = currentUser ? circle.members.find(m => m.userId === currentUser.id) : null;

    return (

        <div className="px-4 pt-6 pb-6 flex flex-col gap-6 w-full">
            {/* Stats Card */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-text-sub dark:text-text-sub-dark uppercase tracking-wider">
                        Total Pool
                    </span>
                    <span className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">
                        ${circle.payoutTotal.toLocaleString()}
                    </span>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full">
                        <span className="material-symbols-outlined text-[16px]">
                            calendar_month
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide">
                            Next: Nov 1
                        </span>
                    </div>
                    <span className="text-[11px] font-medium text-text-sub dark:text-text-sub-dark pr-1">
                        Paid out monthly
                    </span>
                </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">Circle Members</h2>
                    <span className="text-sm font-medium text-text-sub dark:text-text-sub-dark">({circle.members.length})</span>
                </div>

                <InviteButton circleId={circle.id} />
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3">
                {sortedMembers.map((member) => {
                    const isMe = currentUser && member.userId === currentUser.id;
                    return (
                        <div
                            key={member.userId}
                            className={`bg-white dark:bg-surface-dark rounded-xl p-4 flex items-center justify-between shadow-sm border transition-all ${isMe ? 'border-primary/30 ring-1 ring-primary/10' : 'border-transparent hover:border-gray-200 dark:hover:border-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-3.5 overflow-hidden">
                                {/* Payout Order Badge (Left Side) */}
                                {member.payoutMonth && (
                                    <div className="flex flex-col items-center justify-center w-8 bg-gray-50 dark:bg-white/5 rounded-lg py-1 border border-gray-100 dark:border-white/10 shrink-0">
                                        <span className="text-[10px] font-bold text-text-sub dark:text-text-sub-dark uppercase leading-none">Pos</span>
                                        <span className="text-lg font-bold text-primary leading-none mt-0.5">{member.payoutMonth}</span>
                                    </div>
                                )}

                                <div
                                    className="w-11 h-11 rounded-full bg-cover bg-center bg-gray-200 shrink-0 border border-gray-100 dark:border-white/10"
                                    style={{ backgroundImage: `url('${member.avatar}')` }}
                                ></div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[15px] font-bold text-text-main dark:text-white truncate">
                                            {isMe ? 'You' : member.name}
                                        </p>
                                        {member.role === 'admin' && (
                                            <span className="material-symbols-outlined text-[14px] text-primary" title="Admin">
                                                verified_user
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-sub dark:text-text-sub-dark font-medium">
                                        {member.payoutMonth ? `Payout Month ${member.payoutMonth}` : 'Payout TBD'}
                                    </p>
                                </div>
                            </div>

                            {member.role === 'admin' && member.status === 'pending' ? (
                                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                                    <span className="text-xs font-bold capitalize">Admin</span>
                                </div>
                            ) : (
                                <>
                                    {/* Inline Admin Actions for Requests */}
                                    {currentUser?.id === circle.adminId ? (
                                        <div className="flex items-center gap-2">
                                            {member.status === 'requested' && (
                                                <>
                                                    <form action={updateMemberStatusAction.bind(null, circle.id, member.userId, 'rejected')}>
                                                        <button className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors" title="Reject">
                                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                                        </button>
                                                    </form>
                                                    <form action={updateMemberStatusAction.bind(null, circle.id, member.userId, 'approved')}>
                                                        <button className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors" title="Approve">
                                                            <span className="material-symbols-outlined text-[18px]">check</span>
                                                        </button>
                                                    </form>
                                                </>
                                            )}
                                            {member.status === 'paid_pending' && (
                                                <form action={verifyPaymentAction.bind(null, circle.id, member.userId)}>
                                                    <button
                                                        type="submit"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200"
                                                        title="Verify Payment"
                                                    >
                                                        <span className="text-[10px] font-bold uppercase tracking-wide">Verify</span>
                                                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                                                    </button>
                                                </form>
                                            )}
                                            {/* Default Status Badge if no action needed or for info */}
                                            {!['requested', 'paid_pending'].includes(member.status) && (
                                                <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${member.status === 'paid'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {member.status === 'paid' ? 'check_circle' : 'hourglass_empty'}
                                                    </span>
                                                    <span className="text-xs font-bold capitalize">{member.status === 'pending' ? 'Unpaid' : member.status}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${member.status === 'paid'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : member.status === 'paid_pending'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                                            }`}>
                                            <span className="material-symbols-outlined text-[16px]">
                                                {member.status === 'paid' ? 'check_circle' : member.status === 'paid_pending' ? 'hourglass_top' : 'hourglass_empty'}
                                            </span>
                                            <span className="text-xs font-bold capitalize">
                                                {member.status === 'pending' ? 'Unpaid' :
                                                    member.status === 'paid_pending' ? 'Verifying' :
                                                        member.status}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}

                {sortedMembers.length === 0 && (
                    <div className="text-center py-10 text-text-sub dark:text-text-sub-dark">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">group_off</span>
                        <p>No members yet.</p>
                    </div>
                )}
            </div>

            <div className="mt-4 px-4 text-center">
                <p className="text-xs text-text-sub dark:text-text-sub-dark/70 max-w-xs mx-auto leading-relaxed">
                    Everyone plays a part. Your reliable payments help the circle thrive for all members.
                </p>
            </div>
        </div>

    );
}
