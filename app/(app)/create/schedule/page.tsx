"use client";

import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addWeeks, addMonths, addDays } from "date-fns";

function CreateScheduleContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Previous Step Data
    const amount = Number(searchParams.get("amount") || "500");
    const membersCount = Number(searchParams.get("members") || "10");
    const frequency = (searchParams.get("freq") || "Weekly") as "Weekly" | "Monthly" | "Bi-Weekly";

    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [schedule, setSchedule] = useState<Date[]>([]);

    // Generate Schedule
    useEffect(() => {
        if (!startDate) return;
        const start = new Date(startDate);
        const dates: Date[] = [];

        for (let i = 0; i < membersCount; i++) {
            let date = new Date(start);
            if (frequency === "Weekly") {
                date = addWeeks(start, i);
            } else if (frequency === "Bi-Weekly") {
                date = addWeeks(start, i * 2);
            } else if (frequency === "Monthly") {
                date = addMonths(start, i);
            }
            dates.push(date);
        }
        setSchedule(dates);
    }, [startDate, membersCount, frequency]);

    const handleNext = () => {
        const params = new URLSearchParams(searchParams.toString());
        // Add new params
        params.set("startDate", startDate);
        params.set("payoutSchedule", JSON.stringify(schedule.map(d => d.toISOString())));

        router.push(`/create/details?${params.toString()}`);
    };

    return (
        <div className="bg-[#f2f1ef] dark:bg-background-dark min-h-screen flex flex-col items-center justify-center font-display pb-20">
            <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-[#f2f1ef] dark:bg-background-dark overflow-hidden text-text-main dark:text-white">

                {/* Header */}
                <div className="flex flex-col pt-6 px-4 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/create/financials" className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors">
                            <span className="material-symbols-outlined">arrow_back_ios_new</span>
                        </Link>
                        <h1 className="font-bold text-lg">Create Circle</h1>
                        <div className="w-8"></div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-6">
                        <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
                        <div className="h-1 flex-1 bg-primary rounded-full"></div>
                        <div className="h-1 flex-1 bg-primary rounded-full"></div>
                        <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
                    </div>

                    <h2 className="text-3xl font-extrabold mb-2">Set Schedule</h2>
                    <p className="text-text-sub dark:text-text-sub-dark text-sm">When should the first round begin?</p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-6 pb-24">

                    {/* Start Date Picker */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm">
                        <label className="text-xs font-bold text-text-sub uppercase tracking-wider mb-4 block">First Contribution Date</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 dark:bg-black/20 text-xl font-bold p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text-main dark:text-white"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <p className="text-xs text-text-sub mt-3">
                            This kicks off Round 1. Subsequent rounds will follow automatically {frequency.toLowerCase()}.
                        </p>
                    </div>

                    {/* Timeline Preview */}
                    <div>
                        <h3 className="font-bold mb-3">Timeline Preview</h3>
                        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                                {schedule.map((date, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                {index + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Round {index + 1}</span>
                                                <span className="text-xs text-text-sub text-left">{format(date, "MMMM d, yyyy")}</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm">${amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Static Action Button */}
                    <div className="mt-4 mb-8">
                        <button
                            onClick={handleNext}
                            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-full shadow-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                        >
                            Confirm Schedule
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default function CreateSchedule() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-[#f2f1ef] dark:bg-background-dark text-primary">Loading...</div>}>
            <CreateScheduleContent />
        </Suspense>
    );
}
