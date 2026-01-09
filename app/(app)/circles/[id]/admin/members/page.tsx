import Link from "next/link";
import { notFound } from "next/navigation";
import { getCircle, Member } from "@/lib/data";
import { updateMemberStatusAction, verifyPaymentAction } from "@/app/actions";

export default async function ManageMembers(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);

    if (!circle) {
        notFound();
    }

    const pendingRequests = circle.members.filter(m => m.status === 'requested');
    const verifiedPayments = circle.members.filter(m => m.status === 'recipient_verified');
    const activeMembers = circle.members.filter(m => m.status !== 'requested');

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <Link href={`/circles/${circle.id}/admin`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                        Manage Members
                    </h2>
                    <span className="text-xs text-text-sub dark:text-text-sub-dark">{circle.members.length} Total</span>
                </div>
                <div className="w-12"></div>
            </div>

            <div className="flex flex-col p-4 gap-8">

                {/* Pending Requests Section */}
                {pendingRequests.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-text-main dark:text-white">Pending Requests</h3>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
                        </div>

                        {pendingRequests.map(member => (
                            <div key={member.userId} className="flex flex-col p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url('${member.avatar}')` }}></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-text-main dark:text-white">{member.name}</span>
                                        <span className="text-xs text-text-sub dark:text-text-sub-dark">Requested to join</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <form action={updateMemberStatusAction.bind(null, circle.id, member.userId, 'rejected')} className="flex-1">
                                        <button className="w-full py-2 rounded-lg border border-gray-200 dark:border-white/10 text-text-sub dark:text-text-sub-dark font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            Reject
                                        </button>
                                    </form>
                                    <form action={updateMemberStatusAction.bind(null, circle.id, member.userId, 'approved')} className="flex-1">
                                        <button className="w-full py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-colors shadow-sm">
                                            Approve
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Verified Payments Section (Ready for Admin Finalization) */}
                {verifiedPayments.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-text-main dark:text-white">Pending Final Approval</h3>
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{verifiedPayments.length}</span>
                        </div>

                        {verifiedPayments.map(member => (
                            <div key={member.userId} className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 shadow-sm animate-in slide-in-from-right-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url('${member.avatar}')` }}></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-text-main dark:text-white">{member.name}</span>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">verified</span>
                                            Verified by Recipient
                                        </span>
                                    </div>
                                </div>
                                <form action={verifyPaymentAction.bind(null, circle.id, member.userId)}>
                                    <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1">
                                        Finalize
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}

                {/* Active Members Section */}
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-lg text-text-main dark:text-white">All Members</h3>
                    <div className="flex flex-col gap-2">
                        {activeMembers.map(member => (
                            <div key={member.userId} className="flex items-center p-3 rounded-xl bg-surface-light dark:bg-white/5 border border-transparent">
                                <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center mr-3" style={{ backgroundImage: `url('${member.avatar}')` }}></div>
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-text-main dark:text-white">{member.name}</span>
                                        {member.role === 'admin' && (
                                            <span className="material-symbols-outlined text-[14px] text-primary" title="Admin">verified_user</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {(member.role !== 'admin' || member.status !== 'pending') && (
                                            <>
                                                <span className={`w-2 h-2 rounded-full ${member.status === 'paid' ? 'bg-green-500' :
                                                        member.status === 'recipient_verified' ? 'bg-blue-500' :
                                                            member.status === 'paid_pending' ? 'bg-orange-400' :
                                                                'bg-yellow-500'
                                                    }`}></span>
                                                <span className="text-xs text-text-sub dark:text-text-sub-dark capitalize">
                                                    {member.status === 'pending' ? 'Unpaid' :
                                                        member.status === 'paid_pending' ? 'Waiting Recipient' :
                                                            member.status === 'recipient_verified' ? 'Verified' :
                                                                member.status}
                                                </span>
                                            </>
                                        )}
                                        {member.role === 'admin' && member.status === 'pending' && (
                                            <span className="text-xs text-text-sub dark:text-text-sub-dark font-medium px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-md">
                                                Circle Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {member.role !== 'admin' && (
                                    <form action={updateMemberStatusAction.bind(null, circle.id, member.userId, 'rejected')}>
                                        <button className="p-2 text-text-sub dark:text-text-sub-dark hover:text-red-500 transition-colors" title="Remove Member">
                                            <span className="material-symbols-outlined text-xl">remove_circle_outline</span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
