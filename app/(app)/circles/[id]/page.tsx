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
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
            {isNew && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500 w-[90%] max-w-sm">
                    <div className="bg-green-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <span className="material-symbols-outlined text-xl">celebration</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Circle Created!</span>
                            <span className="text-xs text-white/90">Invite your community to start saving together.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Cover Image Header */}
            <div className="relative w-full h-44 overflow-hidden">
                {circle.coverImage ? (
                    <img
                        src={circle.coverImage}
                        alt={circle.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-orange-100 to-amber-50 dark:from-primary/30 dark:via-orange-900/20 dark:to-amber-900/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background-light dark:to-background-dark" />

                {/* Share Button */}
                <button className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-lg">
                    <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </button>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col gap-2 px-6 pt-4 pb-4 items-center -mt-6 relative z-10">
                <div className="bg-background-light dark:bg-background-dark rounded-2xl px-6 py-4 shadow-lg border border-gray-100 dark:border-white/5 text-center">
                    <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-text-main dark:text-white mb-1">
                        {circle.name}
                    </h1>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                            {circle.category}
                        </span>
                        {circle.status === 'recruiting' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                                Accepting Members
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Member Preview Strip */}
            <div className="px-6 py-2 mb-2">
                <div className="flex items-center justify-center gap-3">
                    <div className="flex -space-x-2">
                        {circle.members.slice(0, 5).map((member, i) => (
                            <div
                                key={member.userId}
                                className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold ring-2 ring-background-light dark:ring-background-dark"
                                style={{ zIndex: 10 - i, backgroundImage: member.avatar ? `url("${member.avatar}")` : undefined, backgroundSize: 'cover' }}
                            >
                                {!member.avatar && (member.name?.[0]?.toUpperCase() || '?')}
                            </div>
                        ))}
                        {circle.members.length === 0 && (
                            <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-gray-400">person</span>
                            </div>
                        )}
                    </div>
                    <span className="text-sm text-text-sub dark:text-text-sub-dark">
                        {circle.members.length > 0
                            ? `${circle.members.length}/${circle.maxMembers} members`
                            : 'Be the first to join!'
                        }
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center mt-4 mb-2">
                <span className="text-text-sub dark:text-text-sub-dark text-lg font-medium">
                    Circle Savings
                </span>
                <span className="text-[48px] font-extrabold text-primary leading-none tracking-tight">
                    ${circle.payoutTotal.toLocaleString()}
                </span>
                <span className="text-text-sub dark:text-text-sub-dark text-sm mt-1">
                    per round
                </span>
            </div>


            {/* Key Stats Grid */}
            <div className="grid grid-cols-3 gap-3 px-4 mb-6">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                    <span className="text-text-sub dark:text-text-sub-dark text-xs font-bold uppercase tracking-wide">
                        Contribution
                    </span>
                    <span className="text-text-main dark:text-text-main-dark text-lg font-bold mt-1">
                        ${circle.amount}
                    </span>
                    <span className="text-text-sub dark:text-text-sub-dark text-[10px]">
                        {circle.frequency}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                    <span className="text-text-sub dark:text-text-sub-dark text-xs font-bold uppercase tracking-wide">
                        Duration
                    </span>
                    <span className="text-text-main dark:text-text-main-dark text-lg font-bold mt-1">
                        {circle.duration}
                    </span>
                    <span className="text-text-sub dark:text-text-sub-dark text-[10px]">
                        rounds
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                    <span className="text-text-sub dark:text-text-sub-dark text-xs font-bold uppercase tracking-wide">
                        Start
                    </span>
                    <span className="text-text-main dark:text-text-main-dark text-lg font-bold mt-1">
                        {new Date(circle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-text-sub dark:text-text-sub-dark text-[10px]">
                        {new Date(circle.startDate).getFullYear()}
                    </span>
                </div>
            </div>

            {/* How it works Accordion */}
            <div className="px-4 mb-6">
                <details className="group bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-text-main dark:text-white font-bold transition">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <span>How this circle works</span>
                        </div>
                        <span className="material-symbols-outlined transition group-open:-rotate-180">
                            expand_more
                        </span>
                    </summary>
                    <div className="px-4 pb-4 leading-relaxed text-sm text-text-sub dark:text-text-sub-dark">
                        <p className="mb-3">{circle.description}</p>
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-text-main dark:text-white font-medium mb-2">
                                Some members receive their savings sooner. Others save steadily. Everyone contributes equally.
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                <li>{circle.maxMembers} members commit to ${circle.amount.toLocaleString()} {circle.frequency}.</li>
                                <li>Each round, one member receives ${circle.payoutTotal.toLocaleString()}.</li>
                                <li>Turn order is coordinated by the circle admin before starting.</li>
                            </ul>
                        </div>
                    </div>
                </details>
            </div>

            {/* Governance & Timeline Preview */}
            <div className="flex flex-col px-4 gap-3 mb-8">
                <h3 className="text-text-main dark:text-white font-bold text-lg">
                    Timeline & Governance
                </h3>
                {/* Timeline Visual */}
                <div className="relative flex items-center justify-between px-2 py-4">
                    <div className="absolute left-2 right-2 top-1/2 h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full"></div>
                    {/* Start Node */}
                    <div className="flex flex-col items-center gap-1 bg-background-light dark:bg-background-dark px-2">
                        <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                        <span className="text-[10px] font-bold text-primary uppercase">Start</span>
                        <span className="text-[10px] text-text-sub dark:text-text-sub-dark">
                            {new Date(circle.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    {/* Mid Node */}
                    <div className="flex flex-col items-center gap-1 bg-background-light dark:bg-background-dark px-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-background-light dark:ring-background-dark"></div>
                    </div>
                    {/* End Node */}
                    <div className="flex flex-col items-center gap-1 bg-background-light dark:bg-background-dark px-2">
                        <div className="w-3 h-3 rounded-full bg-gray-800 dark:bg-white ring-4 ring-background-light dark:ring-background-dark"></div>
                        <span className="text-[10px] font-bold text-text-main dark:text-white uppercase">End</span>
                        <span className="text-[10px] text-text-sub dark:text-text-sub-dark">
                            {(() => {
                                const start = new Date(circle.startDate);
                                const monthsToAdd = circle.frequency === 'monthly' ? circle.duration :
                                    circle.frequency === 'weekly' ? circle.duration / 4 : circle.duration;
                                const end = new Date(start);
                                if (circle.frequency === 'monthly') end.setMonth(start.getMonth() + circle.duration);
                                else if (circle.frequency === 'weekly') end.setDate(start.getDate() + (circle.duration * 7));
                                return end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                            })()}
                        </span>
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">
                        admin_panel_settings
                    </span>
                    <div className="flex flex-col">
                        <span className="font-bold text-blue-900 dark:text-blue-300 text-sm">Coordinator Managed</span>
                        <span className="text-blue-700 dark:text-blue-400 text-xs mt-0.5 leading-snug">
                            Turn order is assigned by the circle coordinator based on member preferences and needs.
                        </span>
                    </div>
                </div>
            </div>

            {/* Admin/Creator Profile */}
            <div className="flex flex-col px-4 mb-4">
                <h3 className="text-text-main dark:text-white font-bold text-lg mb-3">
                    Circle Coordinator
                </h3>
                {circle.members.filter(m => m.role === 'admin').map(admin => (
                    <div key={admin.userId} className="flex gap-4 items-start p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div
                            className="w-12 h-12 rounded-full bg-gray-300 bg-cover bg-center shrink-0 border-2 border-primary"
                            style={{ backgroundImage: `url("${admin.avatar}")` }}
                        ></div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-text-main dark:text-white">{admin.name}</span>
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md">Coordinator</span>
                            </div>
                            <p className="text-text-sub dark:text-text-sub-dark text-xs italic">
                                "{circle.description || 'Join us to reach your saving goals together!'}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>



            {/* Static Bottom Actions */}
            <div className="w-full p-4 pb-24 bg-transparent">
                <div className="max-w-md mx-auto w-full flex gap-3">
                    <div className="flex-1">
                        <InviteButton
                            circleId={circle.id}
                            circleName={circle.name}
                            text="Share Invite"
                            className="w-full py-4 text-text-main dark:text-white font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark flex gap-2 items-center justify-center"
                        />
                    </div>
                    {user && circle.members.some(m => m.userId === user.id) ? (
                        <Link href={`/circles/${circle.id}/dashboard`} className="flex-[2]">
                            <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition shadow-lg shadow-primary/25">
                                Go to Dashboard
                            </button>
                        </Link>
                    ) : (
                        <Link href={`/circles/${circle.id}/join`} className="flex-[2]">
                            <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-orange-600 transition shadow-lg shadow-primary/25">
                                Request to Participate
                            </button>
                        </Link>
                    )}
                </div>
            </div>

        </div >
    );
}
