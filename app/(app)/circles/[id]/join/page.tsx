"use strict";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCircle, getCurrentUser } from "@/lib/data";

export default async function JoinCircleConfirm(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    console.log('[DEBUG] JoinCircleConfirm Page loading for ID:', params.id);
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser();
    console.log('[DEBUG] JoinCircleConfirm: Circle found?', !!circle, 'User?', !!currentUser);

    if (!circle) {
        console.error('[JoinCircleConfirm] Circle not found for ID:', params.id);
        redirect('/home?error=circle_not_found');
    }

    // Redirect if already a member
    if (currentUser && circle.members.some(m => m.userId === currentUser.id)) {
        redirect(`/circles/${circle.id}/dashboard`);
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">

            {/* Hero Cover Image */}
            <div className="relative w-full h-48 overflow-hidden">
                {circle.coverImage ? (
                    <img
                        src={circle.coverImage}
                        alt={circle.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-orange-100 to-amber-50 dark:from-primary/30 dark:via-orange-900/20 dark:to-amber-900/10" />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background-light dark:to-background-dark" />

                {/* Back Button */}
                <Link
                    href={`/circles/${circle.id}`}
                    className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-lg hover:bg-white dark:hover:bg-black/70 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </Link>

                {/* Progress indicator */}
                <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-8 h-1 rounded-full bg-white/80"></div>
                    <div className="w-8 h-1 rounded-full bg-white/30"></div>
                </div>
            </div>

            {/* Title Section */}
            <div className="px-6 py-4 flex flex-col items-center text-center -mt-6 relative z-10">
                <div className="bg-background-light dark:bg-background-dark rounded-2xl px-6 py-4 shadow-lg border border-gray-100 dark:border-white/5">
                    <h1 className="text-xl font-bold leading-tight mb-1">
                        {circle.name}
                    </h1>
                    <p className="text-text-sub dark:text-text-sub-dark text-sm">
                        Confirm your commitment to join
                    </p>
                </div>
            </div>

            {/* Member Preview Strip (Option A) */}
            <div className="px-6 py-3">
                <div className="flex items-center justify-center gap-2">
                    <div className="flex -space-x-2">
                        {circle.members.slice(0, 4).map((member, i) => (
                            <div
                                key={member.userId}
                                className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold ring-2 ring-background-light dark:ring-background-dark"
                                style={{ zIndex: 10 - i }}
                            >
                                {member.name?.[0]?.toUpperCase() || '?'}
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
                            ? `Join ${circle.members.length} other${circle.members.length > 1 ? 's' : ''}`
                            : 'Be the first to join!'
                        }
                    </span>
                </div>
            </div>

            {/* Quick Stats Row (Option B) */}
            <div className="px-4 mb-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-3 text-center border border-gray-100 dark:border-white/5">
                        <span className="block text-lg font-bold text-text-main dark:text-white">
                            {new Date(circle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs text-text-sub dark:text-text-sub-dark">Starts</span>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-3 text-center border border-gray-100 dark:border-white/5">
                        <span className="block text-lg font-bold text-text-main dark:text-white">
                            {circle.members.length}/{circle.maxMembers}
                        </span>
                        <span className="text-xs text-text-sub dark:text-text-sub-dark">Spots</span>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-3 text-center border border-gray-100 dark:border-white/5">
                        <span className="block text-lg font-bold text-text-main dark:text-white">
                            {circle.duration}
                        </span>
                        <span className="text-xs text-text-sub dark:text-text-sub-dark">Rounds</span>
                    </div>
                </div>
            </div>

            {/* Hero Value Card */}
            <div className="px-4 mb-4">
                <div className="bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col items-center">
                    <p className="text-white/80 font-medium text-sm mb-1 uppercase tracking-wide">Circle Savings</p>
                    <span className="text-5xl font-extrabold tracking-tight mb-4">${circle.payoutTotal.toLocaleString()}</span>

                    <div className="w-full h-px bg-white/20 mb-4"></div>

                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col items-center border-r border-white/20">
                            <span className="text-2xl font-bold">${circle.amount}</span>
                            <span className="text-white/80 text-xs">{circle.frequency} contribution</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{circle.duration}</span>
                            <span className="text-white/80 text-xs">rounds</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* How This Works Dropdown */}
            <div className="px-4 mb-4">
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
                        <p className="mb-3">{circle.description || 'Join a community-driven savings circle where members support each other to reach financial goals.'}</p>
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                <li>{circle.maxMembers} members commit to ${circle.amount.toLocaleString()} {circle.frequency}.</li>
                                <li>Each round, one member receives ${circle.payoutTotal.toLocaleString()}.</li>
                                <li>Turn order is coordinated by the admin before starting.</li>
                            </ul>
                        </div>
                    </div>
                </details>
            </div>

            {/* Circle Coordinator - Emphasized */}
            <div className="px-4 mb-6">
                <h3 className="text-text-main dark:text-white font-bold text-base mb-3">Circle Coordinator</h3>
                {circle.members.filter(m => m.role === 'admin').map(admin => (
                    <div key={admin.userId} className="flex gap-4 items-center p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-50 dark:from-primary/10 dark:to-orange-900/10 border-2 border-primary/20 shadow-sm">
                        <div
                            className="w-14 h-14 rounded-full bg-gray-300 bg-cover bg-center shrink-0 ring-3 ring-primary shadow-lg"
                            style={{ backgroundImage: admin.avatar ? `url("${admin.avatar}")` : undefined }}
                        >
                            {!admin.avatar && (
                                <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                                    {admin.name?.[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-text-main dark:text-white text-lg">{admin.name}</span>
                                <span className="bg-primary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Coordinator</span>
                            </div>
                            <p className="text-text-sub dark:text-text-sub-dark text-sm">
                                Manages this circle and assigns payout order
                            </p>
                        </div>
                    </div>
                ))}
                {circle.members.filter(m => m.role === 'admin').length === 0 && (
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-center text-text-sub dark:text-text-sub-dark text-sm">
                        Coordinator information will be available soon.
                    </div>
                )}
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-auto px-6 pb-6">
                <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary transition-colors cursor-pointer mb-4">
                    <input type="checkbox" className="mt-1 w-5 h-5 accent-primary rounded-md" />
                    <span className="text-sm text-text-sub dark:text-text-sub-dark leading-snug">
                        I understand that this is a shared saving commitment, and that members take turns accessing the group's savings. I agree to the <span className="font-bold text-text-main dark:text-white underline">Circle Rules</span>.
                    </span>
                </label>

                <Link href={`/circles/${circle.id}/join/intent`}>
                    <button className="w-full h-14 bg-text-main dark:bg-white text-white dark:text-text-main font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
                        Commit to This Circle
                        <span className="material-symbols-outlined">check_circle</span>
                    </button>
                </Link>
            </div>

        </div>
    );
}
