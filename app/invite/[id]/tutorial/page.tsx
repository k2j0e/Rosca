"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/app/components/Logo";

// Reuse step logic from Onboarding, but customized for context
export default function InviteTutorial({ params }: { params: { id: string } }) {
    const [step, setStep] = useState(0);
    const router = useRouter();
    const circleId = params.id;

    const slides = [
        {
            title: "How it works: Step 1",
            headline: "Everyone contributes.",
            desc: "You and your friends pay a set amount into the pool on a regular schedule.",
            icon: "payments",
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            title: "How it works: Step 2",
            headline: "One person receives.",
            desc: "Each round, one member gets the entire pot. It rotates until everyone has received it.",
            icon: "volunteer_activism",
            color: "text-green-500",
            bg: "bg-green-100 dark:bg-green-900/20"
        },
        {
            title: "How it works: Step 3",
            headline: "0% Interest. 100% Trust.",
            desc: "No fees, no debt. Just a community helping each other reach goals faster.",
            icon: "verified_user",
            color: "text-orange-500",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    const currentSlide = slides[step];

    const nextStep = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            // Final Step - Go to Signup with callback
            router.push(`/signup?redirect=/circles/${circleId}/join`);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">
            {/* Header */}
            <div className="p-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-text-main dark:text-white">
                    <Logo size="md" variant="outline" />
                    <span>Circle8<span className="text-primary">.</span></span>
                </Link>
                <div className="text-sm font-bold text-text-sub">
                    Step {step + 1} of 3
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full">

                {/* Visual */}
                <div className={`w-32 h-32 rounded-[2rem] ${currentSlide.bg} flex items-center justify-center mb-8 transition-colors duration-500`}>
                    <span className={`material-symbols-outlined text-[64px] ${currentSlide.color} transition-colors duration-500`}>
                        {currentSlide.icon}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white mb-4 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-500 key={step}">
                    {currentSlide.headline}
                </h1>

                <p className="text-lg text-text-sub dark:text-text-sub-dark mb-12 leading-relaxed max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4 delay-75 duration-500 key={step+10}">
                    {currentSlide.desc}
                </p>

                {/* Dots */}
                <div className="flex gap-2 mb-12">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setStep(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}
                            aria-label={`Go to step ${i + 1}`}
                        ></button>
                    ))}
                </div>

                {/* Actions */}
                <button
                    onClick={nextStep}
                    className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:scale-[1.02] shadow-xl shadow-primary/25 transition-all active:scale-[0.98]"
                >
                    {step === slides.length - 1 ? "Create Account & Join" : "Next"}
                </button>

                {step === slides.length - 1 && (
                    <Link href={`/signin?redirect=${encodeURIComponent(`/circles/${circleId}/join`)}`} className="w-full">
                        <button className="w-full py-4 mt-3 bg-primary/10 text-primary font-bold text-lg rounded-2xl hover:bg-primary/20 transition-all active:scale-[0.98]">
                            Have Account? Sign In
                        </button>
                    </Link>
                )}

            </main>
        </div>
    );
}
