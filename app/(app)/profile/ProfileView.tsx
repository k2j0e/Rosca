'use client';

import { useState } from 'react';
import { signOutAction } from "@/app/actions";
import ProfileEditModal from "./ProfileEditModal";
import ProfileNudge from "@/app/components/ProfileNudge";
import { ExplainCircle8Trigger } from "@/app/components/ExplainCircle8";

// Badge Config
const BADGE_CONFIG: Record<string, { label: string, icon: string, color: string }> = {
    'early-backer': { label: 'Early Backer', icon: 'rocket_launch', color: 'bg-amber-100 text-amber-700' },
    'consistent': { label: 'Consistent', icon: 'savings', color: 'bg-emerald-100 text-emerald-700' },
    'guide': { label: 'Guide', icon: 'groups', color: 'bg-purple-100 text-purple-700' },
    'supporter': { label: 'Supporter', icon: 'handshake', color: 'bg-blue-100 text-blue-700' },
};

// Props
interface ProfileViewProps {
    user: any;
    history?: any[]; // Ledger entries
}

export default function ProfileView({ user, history = [] }: ProfileViewProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Fallback data logic 
    const stats = user?.stats || { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 };
    const badges = user?.badges || [];

    return (
        <div className="flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white pb-24">

            {/* Modal */}
            <ProfileEditModal
                user={{
                    name: user?.name || '',
                    email: user?.email || null,
                    bio: user?.bio || null,
                    location: user?.location || null,
                    avatar: user?.avatar || null
                }}
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
            />

            {/* TopAppBar */}
            <div className="flex items-center px-6 pt-14 pb-4 justify-between sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">
                    Profile
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-full text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col px-6 pb-6 overflow-y-auto w-full max-w-lg mx-auto">
                <ProfileNudge
                    missingFields={[
                        !user?.email && 'email',
                        !user?.bio && 'bio',
                        !user?.location && 'location'
                    ].filter(Boolean) as string[]}
                    onEdit={() => setIsEditing(true)}
                />

                {/* Profile Hero */}
                <div className="flex flex-col items-center py-6">
                    <div className="relative mb-4 group cursor-pointer" onClick={() => setIsEditing(true)}>
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-orange-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition duration-500"></div>
                        <div
                            className="relative w-28 h-28 rounded-full bg-cover bg-center border-4 border-white dark:border-surface-dark shadow-xl"
                            style={{ backgroundImage: `url('${user?.avatar || ''}')` }}
                        ></div>
                        <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-[3px] border-white dark:border-surface-dark flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-text-main dark:text-white mb-1">
                        {user?.name || 'User'}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-text-sub dark:text-text-sub-dark mb-4">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">Member</span>
                        <span>Since {user?.memberSince || '2023'}</span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex w-full items-center justify-between px-4 py-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="flex flex-col items-center flex-1 border-r border-gray-100 dark:border-white/5">
                            <span className="text-lg font-bold text-text-main dark:text-white">{stats.circlesCompleted}</span>
                            <span className="text-[10px] uppercase font-bold text-text-sub dark:text-text-sub-dark tracking-wide">Circles</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 border-r border-gray-100 dark:border-white/5">
                            <span className="text-lg font-bold text-text-main dark:text-white">
                                {stats.onTimePercentage}%
                            </span>
                            <span className="text-[10px] uppercase font-bold text-text-sub dark:text-text-sub-dark tracking-wide">Reliability</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-lg font-bold text-text-main dark:text-white">{stats.supportCount}</span>
                            <span className="text-[10px] uppercase font-bold text-text-sub dark:text-text-sub-dark tracking-wide">Support</span>
                        </div>
                    </div>
                </div>

                {/* Menu / Settings */}
                <div className="flex flex-col gap-3 mb-8">
                    <h3 className="font-bold text-lg text-text-main dark:text-white px-1">Account</h3>

                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-1 shadow-sm border border-gray-100 dark:border-white/5">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">badge</span>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-text-main dark:text-white text-sm">Personal Information</span>
                                    <span className="text-xs text-text-sub dark:text-text-sub-dark">Email, Phone, Bio</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">chevron_right</span>
                        </button>

                        <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-4"></div>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-text-main dark:text-white text-sm">Payment Methods</span>
                                    <span className="text-xs text-text-sub dark:text-text-sub-dark">Manage cards & banks</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">chevron_right</span>
                        </button>

                        <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-4"></div>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">notifications</span>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-text-main dark:text-white text-sm">Notifications</span>
                                    <span className="text-xs text-text-sub dark:text-text-sub-dark">Push & Email</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* Badges */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-bold text-lg text-text-main dark:text-white">Badges</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                        {badges.map((badgeId: string) => {
                            const config = BADGE_CONFIG[badgeId] || { label: badgeId, icon: 'badge', color: 'bg-gray-100 text-gray-700' };
                            return (
                                <div key={badgeId} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-[20px] p-4 min-w-[120px] flex flex-col items-center text-center gap-3 shrink-0 shadow-sm">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
                                        <span className="material-symbols-outlined text-[24px]">{config.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-sm text-text-main dark:text-white">{config.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                        {badges.length === 0 && (
                            <div className="text-sm text-text-sub dark:text-text-sub-dark italic p-2 bg-gray-50 dark:bg-white/5 rounded-xl w-full text-center">
                                Complete circles to earn badges!
                            </div>
                        )}
                    </div>
                </div>

                {/* Sign Out */}
                <div className="mt-4">
                    <form action={signOutAction}>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 font-bold transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                            Sign Out
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
