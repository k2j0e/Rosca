"use strict";

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFinancials() {
    const router = useRouter();
    const [targetAmount, setTargetAmount] = useState<number>(500);
    const [numRounds, setNumRounds] = useState<number>(10);
    const [frequency, setFrequency] = useState<"Weekly" | "Monthly" | "Bi-Weekly">("Weekly");
    const [membersCount, setMembersCount] = useState<number>(10); // Derived or set? Design implies rounds == members often, but let's keep separate or derived. Design says "10 Rounds" and small "10 MEMBERS" badge below. Let's link them for now as per typical ROSCA.

    const contribution = targetAmount; // Design says "Contribution Amount $500", "Per person, per round".
    const totalPot = contribution * numRounds; // "Each member gets $5,000 one-time" -> 500 * 10
    const durationLabel = frequency === "Weekly" ? "Weeks" : frequency === "Monthly" ? "Months" : "Bi-Weeks";

    const handleNext = () => {
        const params = new URLSearchParams({
            amount: contribution.toString(),
            members: numRounds.toString(), // assuming rounds == members for simple rotation
            freq: frequency
        });
        router.push(`/create/schedule?${params.toString()}`);
    };

    const toggleFrequency = (freq: "Weekly" | "Monthly" | "Bi-Weekly") => {
        setFrequency(freq);
    };

    const incrementRounds = () => setNumRounds(curr => Math.min(curr + 1, 50));
    const decrementRounds = () => setNumRounds(curr => Math.max(curr - 1, 3));

    // Update members count when rounds change (simple rotation model)
    // For this MVP, we assume a standard ROSCA where members == rounds
    const actualMembersCount = numRounds;

    // We can just use numRounds for display as members count for now as they are 1:1 in simple ROSCAs
    const membersCountDisplay = actualMembersCount;

    return (
        <div className="bg-[#f2f1ef] dark:bg-background-dark min-h-screen flex flex-col items-center justify-center font-display pb-20">
            <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-[#f2f1ef] dark:bg-background-dark overflow-hidden text-text-main dark:text-white">

                {/* Header */}
                <div className="flex flex-col pt-6 px-4 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors">
                            <span className="material-symbols-outlined">arrow_back_ios_new</span>
                        </Link>
                        <h1 className="font-bold text-lg">Create Circle</h1>
                        <div className="w-8"></div> {/* Spacer for center alignment */}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-6">
                        <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
                        <div className="h-1 flex-1 bg-primary rounded-full"></div>
                        <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
                        <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
                    </div>

                    <h2 className="text-3xl font-extrabold mb-2">Set Financials</h2>
                    <p className="text-text-sub dark:text-text-sub-dark text-sm">Define the contribution details for your trusted circle.</p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-6 pb-24">

                    {/* Card: Contribution Amount */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm">
                        <label className="text-xs font-bold text-text-sub uppercase tracking-wider mb-4 block">Contribution Amount</label>
                        <div className="flex items-center border-b border-gray-200 dark:border-white/10 pb-2 mb-2">
                            <span className="text-3xl font-bold text-gray-400 mr-2">$</span>
                            <input
                                type="number"
                                className="w-full bg-transparent text-4xl font-bold focus:outline-none text-text-main dark:text-white"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(Number(e.target.value))}
                            />
                            <span className="text-sm font-bold text-text-sub">USD</span>
                        </div>
                        <p className="text-xs text-text-sub">Per person, per round.</p>
                    </div>

                    {/* Cadence */}
                    <div>
                        <div className="flex items-center gap-1 mb-3">
                            <h3 className="font-bold">Cadence</h3>
                            <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide p-1">
                            {(["Weekly", "Bi-Weekly", "Monthly"] as const).map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => toggleFrequency(freq)}
                                    className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${frequency === freq
                                        ? "bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-[#f2f1ef]"
                                        : "bg-white dark:bg-surface-dark text-text-sub dark:text-text-sub-dark hover:bg-gray-50"
                                        }`}
                                >
                                    {freq}
                                    {frequency === freq && <span className="ml-2 material-symbols-outlined text-[10px] bg-white text-primary rounded-full p-[1px]">check</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <h3 className="font-bold mb-1">Duration</h3>
                        <p className="text-xs text-text-sub mb-4">Determines group size</p>

                        <div className="flex items-center justify-between bg-white dark:bg-surface-dark p-2 rounded-2xl shadow-sm">
                            <button
                                onClick={decrementRounds}
                                className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl text-2xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                -
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold">{numRounds} Rounds</span>
                                <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full mt-1">{numRounds} MEMBERS</span>
                            </div>
                            <button
                                onClick={incrementRounds}
                                className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-xl text-2xl font-bold hover:bg-primary/90 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Dark Summary Card */}
                    <div className="bg-[#2a3c4d] text-white p-6 rounded-3xl shadow-lg mt-2">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Pot Size</p>
                                <p className="text-4xl font-bold">${totalPot.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                                <span className="material-symbols-outlined text-orange-400 text-sm">savings</span>
                                <span className="text-xs font-bold">Interest-free</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-t border-white/10">
                                <span className="text-white/70 text-sm">Each member gets</span>
                                <span className="font-bold text-lg">${totalPot.toLocaleString()} one-time</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-t border-white/10">
                                <span className="text-white/70 text-sm">Total timeline</span>
                                <span className="font-bold text-lg">{numRounds} {durationLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* Static Action Button */}
                    <div className="mt-4 mb-8">
                        <button
                            onClick={handleNext}
                            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-full shadow-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                        >
                            Review Structure
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
