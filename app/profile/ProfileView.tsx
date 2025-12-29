'use client';

import { useState } from 'react';
import { signOutAction } from "../actions";
import ProfileEditModal from "./ProfileEditModal";
import ProfileNudge from "../components/ProfileNudge";

// Badge Config
const BADGE_CONFIG: Record<string, { label: string, icon: string, color: string }> = {
    'early-backer': { label: 'Early Backer', icon: 'rocket_launch', color: 'bg-amber-100 text-amber-700' },
    'consistent': { label: 'Consistent', icon: 'savings', color: 'bg-emerald-100 text-emerald-700' },
    'guide': { label: 'Guide', icon: 'groups', color: 'bg-purple-100 text-purple-700' },
    'supporter': { label: 'Supporter', icon: 'handshake', color: 'bg-blue-100 text-blue-700' },
};

// Props
interface ProfileViewProps {
    user: any; // Using any for simplicity as User type is complex and shared via lib/data
}

export default function ProfileView({ user }: ProfileViewProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Fallback data logic (moved from page.tsx)
    const stats = user?.stats || { circlesCompleted: 3, onTimePercentage: 98, supportCount: 8 };
    const history = user?.history || [];
    const badges = user?.badges || ['early-backer', 'consistent'];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">

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
            <div className="flex items-center px-4 py-3 justify-between sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <div className="w-10"></div>
                <h2 className="text-text-main dark:text-white text-[17px] font-bold tracking-tight">
                    Trust Passport
                </h2>
                <div className="p-2 -mr-2 text-text-sub dark:text-text-sub-dark">
                    <span className="material-symbols-outlined">help</span>
                </div>
            </div>

            <div className="flex flex-col px-5 pb-6 overflow-y-auto">
                <ProfileNudge
                    missingFields={[
                        !user?.email && 'email',
                        !user?.bio && 'bio',
                        !user?.location && 'location'
                    ].filter(Boolean) as string[]}
                    onEdit={() => setIsEditing(true)}
                />

                {/* Profile Header */}
                <div className="flex flex-col items-center pt-2 pb-6 relative">

                    {/* Trigger Button */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-3 right-4 p-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-full text-slate-700 dark:text-white hover:bg-white dark:hover:bg-white/10 transition-colors z-0"
                        title="Edit Profile"
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </button>

                    <div className="relative mb-3 group">
                        <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-300 to-orange-400 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition duration-500"></div>
                        <div
                            className="relative w-28 h-28 rounded-full bg-cover bg-center border-4 border-white dark:border-surface-dark shadow-sm"
                            style={{ backgroundImage: `url('${user?.avatar || ''}')` }}
                        ></div>
                        <div className={`absolute bottom-1 right-1 ${user?.email ? 'bg-blue-500' : 'bg-gray-400'} text-white p-1 rounded-full border-[3px] border-white dark:border-surface-dark flex items-center justify-center shadow-sm`}>
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-text-main dark:text-white mb-1">
                        {user?.name || 'User'}
                    </h1>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-sub dark:text-text-sub-dark font-medium">Member since {user?.memberSince || '2023'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                        <span className={`font-bold ${user?.email ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                            {user?.email ? 'Verified Profile' : 'Unverified'}
                        </span>
                    </div>
                    {user?.bio && (
                        <p className="text-center text-sm text-text-sub dark:text-text-sub-dark mt-3 max-w-[280px] leading-relaxed">
                            "{user.bio}"
                        </p>
                    )}
                </div>

                {/* Trust Statement */}
                <div className="mb-8 text-center px-2">
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 leading-tight">
                        You are a reliable<br />community pillar.
                    </h3>
                    <p className="text-text-sub dark:text-text-sub-dark/80 text-[15px] leading-relaxed">
                        Your consistent support helps your circle thrive.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[20px] p-5 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-between min-h-[140px]">
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined">all_inclusive</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-text-sub dark:text-text-sub-dark uppercase tracking-wider mb-1">Impact</span>
                            <span className="text-3xl font-bold text-text-main dark:text-white mb-0.5">{stats.circlesCompleted}</span>
                            <span className="text-[13px] text-text-sub dark:text-text-sub-dark font-medium leading-tight">Circles fully completed</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-[20px] p-5 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-between min-h-[140px]">
                        <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-text-sub dark:text-text-sub-dark uppercase tracking-wider mb-1">Habit</span>
                            <div className="flex items-baseline gap-0.5 mb-0.5">
                                <span className="text-3xl font-bold text-text-main dark:text-white">{stats.onTimePercentage}</span>
                                <span className="text-lg font-bold text-text-sub dark:text-text-sub-dark">%</span>
                            </div>
                            <span className="text-[13px] text-text-sub dark:text-text-sub-dark font-medium leading-tight">On-time contributions</span>
                        </div>
                    </div>
                </div>

                {/* Community Supporter Card */}
                <div className="bg-[#FAF8F3] dark:bg-surface-dark rounded-[20px] p-5 mb-8 flex items-center gap-4 border border-transparent dark:border-white/5">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 shrink-0 flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-amber-500 text-[24px]">handshake</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-text-main dark:text-white text-[15px] mb-0.5">Community Supporter</span>
                        <p className="text-[13px] text-text-sub dark:text-text-sub-dark leading-snug">
                            You supported others <span className="font-bold text-amber-600 dark:text-amber-500">{stats.supportCount} times</span> before taking your own payout.
                        </p>
                    </div>
                </div>

                {/* Badges & Roles */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="font-bold text-lg text-text-main dark:text-white">Badges & Roles</h3>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-500">View all</span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                        {badges.map((badgeId: string) => {
                            const config = BADGE_CONFIG[badgeId] || { label: badgeId, icon: 'badge', color: 'bg-gray-100 text-gray-700' };
                            return (
                                <div key={badgeId} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-[20px] p-4 min-w-[140px] flex flex-col items-center text-center gap-3 shrink-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
                                        <span className="material-symbols-outlined text-[24px]">{config.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-sm text-text-main dark:text-white">{config.label}</span>
                                        <span className="text-[11px] text-text-sub dark:text-text-sub-dark font-medium">Earned 2023</span>
                                    </div>
                                </div>
                            );
                        })}
                        {badges.length === 0 && (
                            <div className="text-sm text-text-sub dark:text-text-sub-dark italic p-2">No badges yet. Join circles to earn them!</div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg text-text-main dark:text-white mb-4 px-1">Recent Activity</h3>
                    <div className="flex flex-col gap-5">
                        {history.length > 0 ? history.map((item: any) => (
                            <div key={item.id} className="flex items-start gap-4">
                                <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'contribution' ? 'bg-orange-100 text-orange-600' :
                                    item.type === 'endorsement' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                    <span className="material-symbols-outlined text-[20px]">
                                        {item.type === 'contribution' ? 'check_circle' :
                                            item.type === 'endorsement' ? 'thumb_up' : 'lock_open'}
                                    </span>
                                </div>
                                <div className="flex flex-col flex-1 gap-0.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[15px] text-text-main dark:text-white">{item.title}</span>
                                        <span className="text-[11px] font-medium text-text-sub dark:text-text-sub-dark">
                                            {/* Simple relative time logic or just mock for design match */}
                                            {new Date(item.timestamp).getDate() < 20 ? '2d ago' : '1w ago'}
                                        </span>
                                    </div>
                                    <span className="text-[13px] text-text-sub dark:text-text-sub-dark">{item.subtitle}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-text-sub">No recent activity.</p>
                        )}
                    </div>
                </div>

                {/* Settings & Sign Out (Collapsible or Bottom) */}
                <div className="mt-4 border-t border-gray-100 dark:border-white/5 pt-6">
                    <form action={signOutAction} className="mt-2">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer text-text-sub dark:text-text-sub-dark hover:text-red-500 transition-colors text-sm font-bold">
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Sign Out
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
