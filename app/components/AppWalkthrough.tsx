"use client";

import { useState } from "react";
import Link from "next/link";

export default function AppWalkthrough({ circle }: { circle: any }) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Save Together",
            description: `Join ${circle.members.length} others in ${circle.name} to reach your $${circle.payoutTotal.toLocaleString()} goal.`,
            icon: "groups"
        },
        {
            title: "Zero Interest",
            description: "No fees, no interest. Just community support.",
            icon: "savings"
        },
        {
            title: "Rotational Payouts",
            description: `Receive the full $${circle.payoutTotal.toLocaleString()} when it's your turn.`,
            icon: "currency_exchange"
        }
    ];

    return (
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
            {/* Step Indicators */}
            <div className="flex gap-2 justify-center mb-6">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-2 bg-gray-200 dark:bg-white/20"}`}
                    />
                ))}
            </div>

            {/* Content Carousel */}
            <div className="relative min-h-[160px]">
                {steps.map((s, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-500 ease-in-out ${i === step ? "opacity-100 translate-x-0" :
                            i < step ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full"
                            }`}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary mb-4">
                            <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">{s.title}</h3>
                        <p className="text-text-sub dark:text-text-sub-dark text-sm leading-relaxed max-w-[260px]">
                            {s.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Navigation / Actions */}
            <div className="mt-6 flex justify-between items-center">
                {step < steps.length - 1 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="w-full py-4 bg-gray-100 dark:bg-white/10 text-text-main dark:text-white font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                        Next
                    </button>
                ) : (
                    <div className="w-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4">
                        <Link href={`/signup?redirect=${encodeURIComponent(`/circles/${circle.id}/join`)}`}>
                            <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-transform active:scale-[0.98]">
                                Accept Invitation
                            </button>
                        </Link>
                        <div className="text-center">
                            <span className="text-xs text-text-sub dark:text-text-sub-dark">Already have an account? </span>
                            <Link href={`/signin?redirect=${encodeURIComponent(`/circles/${circle.id}/join`)}`} className="text-primary font-bold text-xs hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
