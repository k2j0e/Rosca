"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createCircleAction } from "@/app/actions";

function CreateDetailsContent() {
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount") || "100";
    const membersCount = searchParams.get("members") || "10";
    const frequency = searchParams.get("freq") || "Monthly";

    const [category, setCategory] = useState<string>("Travel"); // Default to Travel
    const [privacy, setPrivacy] = useState<"public" | "private">("public");
    const [rules, setRules] = useState<string[]>([
        "Admin approval required for payout",
        "Late payments incur -5 reputation points"
    ]);
    const [newRule, setNewRule] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const addRule = () => {
        if (newRule.trim()) {
            setRules([...rules, newRule.trim()]);
            setNewRule("");
        }
    };

    const removeRule = (index: number) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center font-display pb-32">
            <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark overflow-hidden text-text-main dark:text-white">

                {/* Header */}
                <div className="flex items-center px-4 py-4 justify-between bg-background-light dark:bg-background-dark z-10 sticky top-0">
                    <Link href="/create/financials" className="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <span className="font-bold text-lg">Define Purpose</span>
                    <div className="w-8"></div>
                </div>

                <div className="px-6 pb-6">
                    <h1 className="text-3xl font-extrabold leading-tight mb-2">What brings this circle together?</h1>
                </div>

                <form action={createCircleAction} className="flex-1 flex flex-col px-6 gap-8 pb-10">
                    {/* Hidden inputs */}
                    <input type="hidden" name="amount" value={amount} />
                    <input type="hidden" name="membersCount" value={membersCount} />
                    <input type="hidden" name="frequency" value={frequency} />
                    <input type="hidden" name="category" value={category} />
                    <input type="hidden" name="privacy" value={privacy} />
                    <input type="hidden" name="rules" value={JSON.stringify(rules)} />
                    <input type="hidden" name="startDate" value={searchParams.get("startDate") || ""} />
                    <input type="hidden" name="payoutSchedule" value={searchParams.get("payoutSchedule") || "[]"} />

                    {/* Cover Photo */}
                    <div>
                        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-200 to-green-300 shadow-inner group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                <span className="text-white font-bold">Change Photo</span>
                            </div>
                            <button type="button" className="absolute bottom-3 right-3 bg-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform text-text-main">
                                Change Photo
                            </button>
                            <input type="hidden" name="coverImage" value="https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&q=80" />
                        </div>
                        <p className="text-xs text-text-sub mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-blue-500">verified</span>
                            Circles with a personal photo build trust 3x faster.
                        </p>
                    </div>

                    {/* Basic Info */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-bold uppercase tracking-wide text-text-sub block mb-2">Circle Name</label>
                            <input
                                name="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., The Cousins' Vacation Fund"
                                className="w-full bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-white/10 rounded-xl p-4 font-bold focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-bold uppercase tracking-wide text-text-sub">The Story</label>
                                <span className="text-xs text-text-sub">{description.length}/500</span>
                            </div>
                            <textarea
                                name="description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Why is this goal important? Share your motivation..."
                                className="w-full bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Rules Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">handshake</span>
                            </div>
                            <h3 className="font-bold text-lg">Circle Rules & Promises</h3>
                        </div>
                        <p className="text-xs text-text-sub leading-relaxed">
                            Clear rules help early recipients enjoy liquidity while ensuring later members feel secure.
                        </p>

                        <div className="flex flex-col gap-3">
                            {rules.map((rule, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 animate-in slide-in-from-left-2 fade-in duration-300">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                                        <span className="text-sm font-medium">{rule}</span>
                                    </div>
                                    <button type="button" onClick={() => removeRule(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                placeholder="Type a custom rule here..."
                                className="flex-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                            />
                            <button
                                type="button"
                                onClick={addRule}
                                className="w-12 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>

                        {/* Suggested Rules Chips */}
                        <div className="flex flex-wrap gap-2">
                            {["Weekly Check-in", "Commit to Full Cycle", "Vote on Payouts"].map(suggestion => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => !rules.includes(suggestion) && setRules([...rules, suggestion])}
                                    className="flex items-center gap-1 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-gray-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category & Privacy (Consolidated/Simplified) */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold focus:outline-none"
                        >
                            {["Travel", "Business", "Emergency", "Education", "Home Improvement", "Debt Consolidation", "Wedding", "Gadgets", "Health/Medical", "Vehicle", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button
                            type="button"
                            onClick={() => setPrivacy(p => p === 'public' ? 'private' : 'public')}
                            className="flex items-center justify-center gap-2 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold"
                        >
                            <span className="material-symbols-outlined text-lg">{privacy === 'public' ? 'public' : 'lock'}</span>
                            {privacy === 'public' ? 'Public' : 'Private'}
                        </button>
                    </div>


                    {/* Static Action Button */}
                    <div className="mt-8 mb-4">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                            Create Circle
                            <span className="material-symbols-outlined">check</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CreateDetails() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark text-primary">Loading...</div>}>
            <CreateDetailsContent />
        </Suspense>
    );
}
