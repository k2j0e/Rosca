"use strict";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCircle, getCurrentUser, MOCK_USER } from "@/lib/data";
import InviteButton from "@/app/components/InviteButton";

export default async function CircleDetail(props: { params: Promise<{ id: string }>, searchParams: Promise<{ new?: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const user = await getCurrentUser();

    if (user?.isBanned) {
        redirect('/suspended');
    }

    if (!circle) {
        notFound();
    }

    const isNew = (await props.searchParams)?.new === 'true';

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white pb-28">
            {isNew && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500 w-[90%] max-w-sm">
                    <div className="bg-emerald-600 text-white px-5 py-4 rounded-3xl shadow-glow flex items-center gap-4 border border-white/20 backdrop-blur-md">
                        <div className="bg-white/20 p-2 rounded-full">
                            <span className="material-symbols-outlined text-xl">celebration</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Circle Created!</span>
                            <span className="text-xs text-white/90 font-medium">Invite your community to start saving together.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Back Button (Floating) */}
            <div className="absolute top-4 left-4 z-20">
                <Link href="/explore">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                </Link>
            </div>

            {/* Cover Image Header - Optimized height for mobile */}
            <div className="relative w-full h-52 overflow-hidden">
                {circle.coverImage ? (
                    <img
                        src={circle.coverImage}
                        alt={circle.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary via-orange-500 to-yellow-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-black/30" />

                {/* Hero Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-bold text-white shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">
                                {circle.category === 'Travel' ? 'flight_takeoff' :
                                    circle.category === 'Business' ? 'storefront' : 'savings'}
                            </span>
                            {circle.category}
                        </span>
                        {circle.status === 'recruiting' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
                                Open for {circle.maxMembers - circle.members.length} more
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                        {circle.name}
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="px-6 -mt-4 relative z-10 flex flex-col gap-6">

                {/* Host Info */}
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {circle.members.slice(0, 5).map((member, i) => (
                            <div
                                key={member.userId}
                                className="w-10 h-10 rounded-full bg-gray-200 border-2 border-background-light dark:border-background-dark bg-cover bg-center"
                                style={{ zIndex: 10 - i, backgroundImage: member.avatar ? `url("${member.avatar}")` : undefined }}
                            >
                                {!member.avatar && (
                                    <span className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        {member.name?.[0]?.toUpperCase() || '?'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <span className="text-sm font-medium text-text-sub dark:text-text-sub-dark">
                        Type: <strong>{circle.frequency}</strong> • Target: <strong>${circle.payoutTotal.toLocaleString()}</strong>
                    </span>
                </div>

                {/* Your Commitment Card */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 shadow-card border border-white dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
                    <h3 className="text-text-sub dark:text-text-sub-dark text-xs font-bold uppercase tracking-wider mb-4">Commitment Details</h3>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold text-text-main dark:text-white">${circle.amount}</span>
                            <span className="text-sm text-text-muted">{circle.frequency} contribution</span>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-200 dark:bg-white/10"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-text-main dark:text-white">{circle.duration}</span>
                            <span className="text-sm text-text-muted">total rounds</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 flex items-center gap-2 text-xs text-text-sub dark:text-text-sub-dark font-medium">
                        <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                        Starts {new Date(circle.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Description & Coordinator */}
                <div className="space-y-4">
                    <h3 className="font-bold text-xl text-text-main dark:text-white">Goal & Story</h3>
                    <div className="prose prose-sm dark:prose-invert text-text-sub dark:text-text-sub-dark leading-relaxed">
                        <p>{circle.description}</p>
                    </div>

                    {/* Coordinator Profile */}
                    {circle.members.filter(m => m.role === 'admin').map((admin) => (
                        <div key={admin.userId} className="flex items-center gap-4 py-4 pt-2">
                            <img src={admin.avatar || ''} className="w-12 h-12 rounded-full border border-gray-100" />
                            <div>
                                <p className="font-bold text-text-main dark:text-white text-sm">Organized by {admin.name}</p>
                                <p className="text-xs text-primary font-bold">Circle Coordinator</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Why Join This Circle */}
                <div>
                    <h3 className="font-bold text-xl text-text-main dark:text-white mb-4">Why Join?</h3>
                    <div className="bg-gradient-to-br from-primary/5 to-orange-50 dark:from-primary/10 dark:to-surface-dark p-5 rounded-3xl border border-primary/10 dark:border-primary/20">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-lg">savings</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-main dark:text-white">Save ${circle.payoutTotal.toLocaleString()}</p>
                                    <p className="text-xs text-text-sub dark:text-text-sub-dark">Receive the full pot when it&apos;s your turn</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-emerald-500 text-lg">group</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-main dark:text-white">{circle.members.length}/{circle.maxMembers} Members</p>
                                    <p className="text-xs text-text-sub dark:text-text-sub-dark">{circle.maxMembers - circle.members.length} spots remaining</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-blue-500 text-lg">verified_user</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-main dark:text-white">Zero Interest</p>
                                    <p className="text-xs text-text-sub dark:text-text-sub-dark">Community-based, no fees or loans</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static Bottom Actions - positioned above bottom nav */}
            <div className="fixed bottom-20 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 z-40">
                <div className="max-w-md mx-auto w-full flex gap-3">
                    <div className="flex-1">
                        <InviteButton
                            circleId={circle.id}
                            circleName={circle.name}
                            text="Share"
                            className="w-full py-4 text-text-main dark:text-white font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark flex gap-2 items-center justify-center shadow-sm"
                        />
                    </div>
                    {user && circle.members.some(m => m.userId === user.id) ? (
                        <Link href={`/circles/${circle.id}/dashboard`} className="flex-[2]">
                            <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition shadow-glow active:scale-95">
                                Go to Dashboard
                            </button>
                        </Link>
                    ) : (
                        <Link href={`/circles/${circle.id}/join`} className="flex-[2]">
                            <button className="w-full py-4 bg-text-main dark:bg-white text-white dark:text-text-main font-bold rounded-2xl hover:bg-black/90 dark:hover:bg-white/90 transition shadow-lg active:scale-95">
                                Join Circle
                            </button>
                        </Link>
                    )}
                </div>
            </div>

        </div >
    );
}
