"use strict";

import Link from "next/link";
import { getCircleAdminDashboardData } from "@/lib/admin-circle";
import { getCurrentUser } from "@/lib/data";
import { redirect, notFound } from "next/navigation";
import { forceCompleteRoundAction, updateMemberStatusAction, verifyPaymentAction } from "@/app/actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    const data = await getCircleAdminDashboardData(params.id);

    if (!data) {
        notFound();
    }

    // Check admin permission
    const isAdmin = data.members.some(m => m.userId === user.id && m.role === 'admin');
    if (!isAdmin) {
        redirect(`/circles/${params.id}/dashboard`);
    }

    const { circle, members, health, recentActions, announcements } = data;

    // Status color mapping
    const statusColors: Record<string, string> = {
        paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        paid_pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        late: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        requested: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display pb-20">
            {/* TopAppBar */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <Link href={`/circles/${params.id}/dashboard`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Coordinator Tools
                </h2>
                <div className="w-12"></div>
            </div>

            {/* Circle Info */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{circle.name}</h1>
                        <p className="text-text-sub dark:text-text-sub-dark text-sm">
                            Round {circle.currentRound} of {circle.maxMembers}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${circle.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        circle.status === 'paused' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            circle.status === 'recruiting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                        {circle.status}
                    </div>
                </div>
                {circle.pauseReason && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl text-sm text-yellow-800 dark:text-yellow-300">
                        <span className="font-bold">Paused:</span> {circle.pauseReason}
                    </div>
                )}
            </div>

            {/* Health Indicators */}
            <div className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20 text-center">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Paid</p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{health.paidPercentage}%</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{health.paidCount}/{health.totalMembers}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20 text-center">
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Late</p>
                        <p className="text-2xl font-black text-red-700 dark:text-red-300">{health.lateCount}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20 text-center">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Requests</p>
                        <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{health.pendingRequests}</p>
                    </div>
                </div>
            </div>

            {/* Action Center Section */}
            {(health.pendingRequests > 0 || members.some(m => m.status === 'recipient_verified')) && (
                <div className="px-4 pb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3 px-2">
                        Action Center
                    </h3>

                    {/* Pending Requests List */}
                    {health.pendingRequests > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-4 overflow-hidden">
                            <div className="p-3 bg-blue-100/50 dark:bg-blue-800/30 flex items-center justify-between">
                                <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">New Member Requests</span>
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{health.pendingRequests}</span>
                            </div>
                            <div className="divide-y divide-blue-100 dark:divide-blue-800/50">
                                {members.filter(m => m.status === 'requested').map((member) => (
                                    <div key={member.id} className="p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold border border-blue-100">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                member.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-text-main dark:text-white">{member.name}</p>
                                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Requested to join</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={async () => {
                                                "use server";
                                                await updateMemberStatusAction(circle.id, member.userId, 'rejected');
                                            }}>
                                                <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors" title="Reject">
                                                    <span className="material-symbols-outlined text-xl">close</span>
                                                </button>
                                            </form>
                                            <form action={async () => {
                                                "use server";
                                                await updateMemberStatusAction(circle.id, member.userId, 'approved');
                                            }}>
                                                <button className="p-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors" title="Approve">
                                                    <span className="material-symbols-outlined text-xl">check</span>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Verifications List */}
                    {members.filter(m => m.status === 'recipient_verified').length > 0 && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 overflow-hidden">
                            <div className="p-3 bg-emerald-100/50 dark:bg-emerald-800/30 flex items-center justify-between">
                                <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">Pending Verification</span>
                                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {members.filter(m => m.status === 'recipient_verified').length}
                                </span>
                            </div>
                            <div className="divide-y divide-emerald-100 dark:divide-emerald-800/50">
                                {members.filter(m => m.status === 'recipient_verified').map((member) => (
                                    <div key={member.id} className="p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold border border-emerald-100">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                member.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-text-main dark:text-white">{member.name}</p>
                                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Recipient confirmed receipt</p>
                                        </div>
                                        <form action={async () => {
                                            "use server";
                                            await verifyPaymentAction(circle.id, member.userId);
                                        }}>
                                            <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">verified</span>
                                                VERIFY
                                            </button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}



            {/* Force Distribute Payout (When all paid but payout not distributed) */}
            {(() => {
                const allActiveMembers = members.filter(m => m.status !== 'requested');
                // Strict validation: must have active members, all paid, no pending verifications, no pending requests
                const hasActiveMembers = allActiveMembers.length > 0;
                const allPaid = hasActiveMembers && allActiveMembers.every(m => m.status === 'paid');
                const noPendingVerifications = members.filter(m => m.status === 'recipient_verified').length === 0;
                const noPendingRequests = members.filter(m => m.status === 'requested').length === 0;

                // Only show if strictly ready to distribute
                if (allPaid && noPendingVerifications && noPendingRequests && circle.status === 'active') {
                    return (
                        <div className="px-4 pb-4">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-2xl text-white shadow-lg shadow-amber-500/20 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xl">savings</span>
                                        <span className="font-bold">All Payments Complete!</span>
                                    </div>
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                                        {allActiveMembers.length}/{allActiveMembers.length} paid
                                    </span>
                                </div>
                                <p className="text-sm text-white/90 mb-3">
                                    All contributions verified. Distribute payout to advance to next round.
                                </p>
                                <form action={async () => {
                                    "use server";
                                    await forceCompleteRoundAction(circle.id);
                                }}>
                                    <button className="w-full bg-white text-amber-600 font-bold py-3 rounded-xl shadow-md hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">payments</span>
                                        Distribute Payout & Start Next Round
                                    </button>
                                </form>
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {/* Member Payment Grid */}
            <div className="px-4 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3 px-2">
                    Member Status
                </h3>
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    {members.filter(m => m.status !== 'requested').map((member, idx) => (
                        <div key={member.id} className={`flex items-center gap-3 p-3 ${idx !== members.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold">
                                {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    member.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{member.name}</p>
                                <p className="text-xs text-text-sub dark:text-text-sub-dark">
                                    Slot #{member.payoutMonth || '—'}
                                    {member.role === 'admin' && <span className="ml-1 text-primary">• Coordinator</span>}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[member.status] || 'bg-gray-100 text-gray-600'}`}>
                                    {member.status}
                                </span>
                                {member.graceApplied && (
                                    <span className="material-symbols-outlined text-yellow-500 text-sm" title="Grace applied">schedule</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3 px-4 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark px-2">
                    Quick Actions
                </h3>

                <Link href={`/circles/${params.id}/admin/settings`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-xl">settings</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">Circle Settings</h4>
                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Edit cover photo, name</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                    </div>
                </Link>

                <Link href={`/circles/${params.id}/admin/members`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined text-xl">group</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">Manage Members</h4>
                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Approve, verify, apply grace</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                    </div>
                </Link>

                <Link href={`/circles/${params.id}/admin/payouts`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-xl">reorder</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">Payout Schedule</h4>
                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Assign slots, reorder</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                    </div>
                </Link>

                <Link href={`/circles/${params.id}/admin/announcements`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                            <span className="material-symbols-outlined text-xl">campaign</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">Announcements</h4>
                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Post updates to members</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                    </div>
                </Link>

                <Link href={`/circles/${params.id}/admin/support`}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 hover:border-red-200 dark:hover:border-red-800 transition-colors group cursor-pointer">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined text-xl">support_agent</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">Escalate to Support</h4>
                            <p className="text-xs text-text-sub dark:text-text-sub-dark">Get help with disputes</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                    </div>
                </Link>
            </div>

            {/* Recent Actions */}
            {recentActions.length > 0 && (
                <div className="px-4 pb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3 px-2">
                        Recent Admin Actions
                    </h3>
                    <div className="space-y-2">
                        {recentActions.slice(0, 5).map(action => (
                            <div key={action.id} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl text-sm">
                                <p className="font-medium">{action.description}</p>
                                <p className="text-xs text-text-sub dark:text-text-sub-dark mt-1">
                                    {action.adminName && `by ${action.adminName}`} • {new Date(action.createdAt).toLocaleDateString()}
                                </p>
                                {action.reason && (
                                    <p className="text-xs text-gray-500 mt-1 italic">Reason: {action.reason}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Announcements */}
            {announcements.length > 0 && (
                <div className="px-4 pb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3 px-2">
                        Announcements
                    </h3>
                    <div className="space-y-2">
                        {announcements.map(a => (
                            <div key={a.id} className={`p-3 rounded-xl text-sm ${a.isPinned ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                                <div className="flex items-center gap-2">
                                    {a.isPinned && <span className="material-symbols-outlined text-primary text-sm">push_pin</span>}
                                    <p className="font-bold">{a.title}</p>
                                </div>
                                <p className="text-text-sub dark:text-text-sub-dark mt-1">{a.body}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
