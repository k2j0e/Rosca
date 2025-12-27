"use client";

import { useState } from "react";
import Image from "next/image";
import { Member, Circle } from "@/lib/data";
import { updatePayoutOrderAction } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function PayoutEditor({ circle, initialMembers }: { circle: Circle, initialMembers: Member[] }) {
    const router = useRouter();
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [mode, setMode] = useState<'manual' | 'randomize'>('manual');
    const [isSaving, setIsSaving] = useState(false);

    const handleRandomize = () => {
        setMode('randomize');
        const shuffled = [...members].sort(() => Math.random() - 0.5);
        setMembers(shuffled);
    };

    const handleManual = () => {
        setMode('manual');
        // logic to reset or just keep current? keeping current is usually better experience
    };

    const moveMember = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === members.length - 1) return;

        const newMembers = [...members];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
        setMembers(newMembers);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Assign payoutMonth based on index (1-based)
        const updatedMembers = members.map((m, index) => ({
            ...m,
            payoutMonth: index + 1
        }));

        await updatePayoutOrderAction(circle.id, updatedMembers);
        setIsSaving(false);
        router.refresh(); // Refresh server data
        router.push(`/circles/${circle.id}/admin`); // Go back to admin dashboard
    };

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="px-6 py-4">
                <div className="p-1 bg-gray-100 dark:bg-white/10 rounded-xl flex gap-1">
                    <button
                        onClick={handleManual}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'manual' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-text-sub'}`}
                    >
                        <span className="material-symbols-outlined text-lg">drag_indicator</span>
                        Manual
                    </button>
                    <button
                        onClick={handleRandomize}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'randomize' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-text-sub'}`}
                    >
                        <span className="material-symbols-outlined text-lg">shuffle</span>
                        Randomize
                    </button>
                </div>
            </div>

            {/* List Header */}
            <div className="px-6 flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Member List</h3>
                <span className="text-xs font-bold text-text-sub bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    {members.length} Members • {circle.frequency}
                </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-32 flex flex-col gap-3">
                {members.map((member, index) => (
                    <div key={member.userId} className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 animate-in slide-in-from-bottom-2 duration-300 fill-mode-both" style={{ animationDelay: `${index * 50}ms` }}>
                        {/* Month Number */}
                        <div className="flex flex-col items-center justify-center w-12 shrink-0 border-r border-gray-100 dark:border-white/5 pr-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark">MTH</span>
                            <span className="text-2xl font-bold text-primary">{String(index + 1).padStart(2, '0')}</span>
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-surface-dark shadow-sm">
                                <Image
                                    src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                                    alt={member.name || "Member"}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            </div>
                            {index === 0 && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                                    1st
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{member.name}</h4>
                            <div className="flex items-center gap-1">
                                {index < 2 ? (
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                        Liquidity Recipient
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                        <span className="material-symbols-outlined text-[10px]">handshake</span>
                                        Supporter
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Drag Handle (Functional Buttons for MVP) */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => moveMember(index, 'up')}
                                disabled={index === 0}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                            </button>
                            <button
                                onClick={() => moveMember(index, 'down')}
                                disabled={index === members.length - 1}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <span className="animate-spin material-symbols-outlined">progress_activity</span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">check_circle</span>
                            Confirm Payout Order
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
