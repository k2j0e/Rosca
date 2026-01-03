"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { completeOnboardingAction } from "@/app/actions";
import { useSearchParams } from "next/navigation";

// Hook for counting numbers up
function useCounter(end: number, duration: number = 2000, trigger: boolean) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) return;

        let start = 0;
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [end, duration, trigger]);

    return count;
}

function OnboardingContent() {
    const [step, setStep] = useState(0);
    const [isShimLoading, setIsShimLoading] = useState(false);
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');
    const totalSteps = 5;

    const potValue = useCounter(1000, 1500, step === 2);
    const monthlyValue = useCounter(100, 1000, step === 2);

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        setIsShimLoading(true);
        await completeOnboardingAction(redirectUrl || undefined);
    };

    const screens = [
        {
            title: "Save together.\nAccess cash.\nNo interest.",
            subtitle: "A trusted group helps each other reach goals — without banks or debt."
        },
        {
            title: "How it works in 3 steps:",
            content: (
                <div className="flex flex-col gap-6 mt-4 w-full">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-center animate-in slide-in-from-right-4 fade-in duration-500 delay-100 fill-mode-forwards opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">1</div>
                        <p className="text-left text-gray-700 dark:text-gray-300 font-medium">Join a savings circle with people you trust.</p>
                    </div>
                    {/* Step 2 */}
                    <div className="flex gap-4 items-center animate-in slide-in-from-right-4 fade-in duration-500 delay-300 fill-mode-forwards opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <div className="size-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">2</div>
                        <p className="text-left text-gray-700 dark:text-gray-300 font-medium">Everyone contributes the same amount perfectly.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="flex gap-4 items-center animate-in slide-in-from-right-4 fade-in duration-500 delay-500 fill-mode-forwards opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <div className="size-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-lg">3</div>
                        <p className="text-left text-gray-700 dark:text-gray-300 font-medium">One person takes the full pot each month — everyone gets a turn.</p>
                    </div>
                </div>
            )
        },
        {
            title: "Real Simple Math",
            content: (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mt-4 w-full text-center">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">10</span>
                            <span className="text-[10px] uppercase text-gray-500">People</span>
                        </div>
                        <div className="flex flex-col border-x border-gray-200 dark:border-gray-700">
                            <span className="text-2xl font-bold">${monthlyValue}</span>
                            <span className="text-[10px] uppercase text-gray-500">Monthly</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">10</span>
                            <span className="text-[10px] uppercase text-gray-500">Months</span>
                        </div>
                    </div>
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-4"></div>
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        Each month, one person gets <span className="font-black text-primary text-xl">${potValue}</span>.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        By the end, everyone has received exactly what they put in. Simple.
                    </p>
                </div>
            )
        },
        {
            title: "Your Money, Your Control",
            content: (
                <div className="flex flex-col gap-4 mt-2 w-full">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-xl flex gap-3 text-left animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">
                        <span className="material-symbols-outlined text-red-500 shrink-0">no_accounts</span>
                        <div>
                            <h4 className="font-bold text-red-900 dark:text-red-400 text-sm">Non-Custodial</h4>
                            <p className="text-xs text-red-800 dark:text-red-300/80">
                                This app <span className="underline">never holds your money</span>. Payments happen directly between members via Zelle, CashApp, or Venmo.
                            </p>
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex gap-3 text-left animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
                        <span className="material-symbols-outlined text-blue-500 shrink-0">visibility</span>
                        <div>
                            <h4 className="font-bold text-blue-900 dark:text-blue-400 text-sm">Member Governed</h4>
                            <p className="text-xs text-blue-800 dark:text-blue-300/80">
                                Circle admins verify payments. Everything is transparent to the group.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Why join a circle?",
            content: (
                <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                    <BenefitCard icon="savings" label="Force Savings" delay={0} />
                    <BenefitCard icon="credit_score" label="No Interest" delay={100} />
                    <BenefitCard icon="bolt" label="Cash Sooner" delay={200} />
                    <BenefitCard icon="diversity_3" label="Support Friends" delay={300} />
                </div>
            )
        }
    ];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-black font-display text-text-main dark:text-white">

            {/* Visual Section */}
            <div className="relative w-full h-[45vh] bg-gray-50 dark:bg-gray-900 overflow-hidden flex items-center justify-center">

                {/* Visual Switcher */}
                {step === 0 && (
                    <Image
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Community"
                        fill
                        className="object-cover animate-in fade-in duration-700"
                        priority
                    />
                )}

                {step === 1 && (
                    // Orbit Animation
                    <div className="relative size-64 flex items-center justify-center animate-in fade-in duration-500">
                        {/* Center Pot */}
                        <div className="absolute size-20 rounded-full bg-primary/20 flex items-center justify-center z-10 shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-4xl text-primary">savings</span>
                        </div>
                        {/* Orbit Track */}
                        <div className="absolute size-56 rounded-full border border-dashed border-gray-300 dark:border-gray-700 animate-[spin_20s_linear_infinite]"></div>

                        {/* Satellites */}
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute size-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-xs"
                                style={{
                                    transform: `rotate(${i * 72}deg) translateX(112px) rotate(-${i * 72}deg)`,
                                }}
                            >
                                <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Other Images for Step 3, 4, 5 (reusing static or implementing simpler visuals) */}
                {step > 1 && (
                    <Image
                        src={step === 2
                            ? "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            : step === 3
                                ? "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                : "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        }
                        alt="Visual"
                        fill
                        className="object-cover animate-in fade-in duration-500"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>

                <button
                    onClick={handleComplete}
                    className="absolute top-4 right-4 text-xs font-bold text-white/80 hover:text-white uppercase tracking-wider bg-black/20 backdrop-blur-md px-3 py-1 rounded-full z-10"
                >
                    Skip
                </button>
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 px-8 pt-4 pb-8 items-center text-center z-10">

                <div className="flex-1 w-full flex flex-col items-center justify-start">
                    <h1
                        key={`title-${step}`}
                        className="text-3xl font-extrabold tracking-tight mb-3 text-gray-900 dark:text-white whitespace-pre-line animate-in slide-in-from-bottom-2 fade-in duration-500"
                    >
                        {screens[step].title}
                    </h1>

                    {screens[step].subtitle && (
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-xs mx-auto animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100">
                            {screens[step].subtitle}
                        </p>
                    )}

                    <div key={`content-${step}`} className="w-full">
                        {screens[step].content}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="w-full mt-auto pt-6">
                    <div className="flex gap-2 justify-center mb-6">
                        {screens.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-gray-200 dark:bg-gray-800'}`}
                            ></div>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={isShimLoading}
                        className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isShimLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                {step === totalSteps - 1 ? "Start Exploring" : "Next"}
                                {step !== totalSteps - 1 && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function WelcomeScreen() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><span className="loader"></span></div>}>
            <OnboardingContent />
        </Suspense>
    );
}

function BenefitCard({ icon, label, delay = 0 }: { icon: string, label: string, delay?: number }) {
    return (
        <div
            className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-forwards opacity-0"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        >
            <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
        </div>
    );
}
