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

// Ledger Animation - shows money flowing from 9 members to 1 recipient
function LedgerAnimation() {
    const [currentRecipient, setCurrentRecipient] = useState(0);
    const [showFlow, setShowFlow] = useState(false);
    const members = ['Maria', 'James', 'Aisha', 'Carlos', 'Sarah', 'David', 'Priya', 'Michael', 'Lisa', 'Ahmed'];

    useEffect(() => {
        // Cycle through recipients every 3 seconds
        const cycleInterval = setInterval(() => {
            setShowFlow(false);
            setTimeout(() => {
                setCurrentRecipient(prev => (prev + 1) % 10);
                setShowFlow(true);
            }, 300);
        }, 3000);

        // Initial show
        setTimeout(() => setShowFlow(true), 500);

        return () => clearInterval(cycleInterval);
    }, []);

    return (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-xs">
                {/* Header */}
                <div className="text-center mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Round {currentRecipient + 1} of 10</span>
                </div>

                {/* Member Grid */}
                <div className="grid grid-cols-5 gap-2">
                    {members.map((name, i) => {
                        const isRecipient = i === currentRecipient;
                        const isContributor = !isRecipient;

                        return (
                            <div
                                key={i}
                                className={`relative flex flex-col items-center transition-all duration-500 ${isRecipient ? 'scale-110 z-10' : 'scale-100'
                                    }`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`size-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${isRecipient
                                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 shadow-lg shadow-primary/30'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                        }`}
                                >
                                    {name[0]}
                                </div>

                                {/* Money indicator */}
                                <div
                                    className={`mt-1 text-[10px] font-bold transition-all duration-300 ${showFlow
                                        ? isRecipient
                                            ? 'text-green-600 opacity-100'
                                            : 'text-gray-400 opacity-100'
                                        : 'opacity-0'
                                        }`}
                                >
                                    {isRecipient ? '+$900' : '-$100'}
                                </div>

                                {/* Flow arrow for contributors */}
                                {isContributor && showFlow && (
                                    <div
                                        className="absolute -top-1 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-500"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className="size-3 rounded-full bg-primary/60 animate-ping"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Total received indicator */}
                <div className={`mt-4 text-center transition-all duration-500 ${showFlow ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-green-600 text-sm">arrow_downward</span>
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                            {members[currentRecipient]} receives <span className="text-green-600">$1,000</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OnboardingContent() {
    const [step, setStep] = useState(0);
    const [isShimLoading, setIsShimLoading] = useState(false);
    const [highlightedUser, setHighlightedUser] = useState(0);
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');
    const totalSteps = 5;

    const savingsValue = useCounter(1000, 1500, step === 4);
    const monthlyValue = useCounter(100, 1000, step === 4);
    const membersValue = useCounter(10, 800, step === 4);
    const monthsValue = useCounter(10, 800, step === 4);

    // Rotating user highlight for slide 2
    useEffect(() => {
        if (step !== 1) return;
        const interval = setInterval(() => {
            setHighlightedUser(prev => (prev + 1) % 6);
        }, 1500);
        return () => clearInterval(interval);
    }, [step]);

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

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-black font-display text-text-main dark:text-white">

            {/* Visual Section */}
            <div className="relative w-full h-[45vh] bg-gray-50 dark:bg-gray-900 overflow-hidden flex items-center justify-center">

                {/* Slide 1: Community Image */}
                {step === 0 && (
                    <Image
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Friends supporting each other"
                        fill
                        className="object-cover animate-in fade-in duration-700"
                        priority
                    />
                )}

                {/* Slide 2: Rotating Circle Animation */}
                {step === 1 && (
                    <div className="relative size-64 flex items-center justify-center animate-in fade-in duration-500">
                        {/* Center Circle with Pulse */}
                        <div className="absolute size-20 rounded-full bg-primary/20 flex items-center justify-center z-10 shadow-lg shadow-primary/20 animate-pulse">
                            <span className="material-symbols-outlined text-4xl text-primary">savings</span>
                        </div>
                        {/* Rotating Orbit Track */}
                        <div className="absolute size-56 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 animate-[spin_25s_linear_infinite]"></div>

                        {/* User Satellites */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={`absolute size-10 rounded-full shadow-md flex items-center justify-center transition-all duration-500 ${highlightedUser === i
                                    ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-400'
                                    }`}
                                style={{
                                    transform: `rotate(${i * 60}deg) translateX(112px) rotate(-${i * 60}deg)`,
                                }}
                            >
                                <span className="material-symbols-outlined text-sm">person</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Slide 3: Diverse People Image with Ken Burns */}
                {step === 2 && (
                    <Image
                        src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Group of diverse friends"
                        fill
                        className="object-cover animate-ken-burns"
                    />
                )}

                {/* Slide 4: Flow Diagram - Non-custodial visual */}
                {step === 3 && (
                    <div className="w-full h-full flex items-center justify-center p-8 animate-in fade-in duration-500">
                        {/* Flow Diagram */}
                        <div className="flex items-center justify-center gap-4">
                            {/* Person A */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-primary">person</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500">Member A</span>
                                <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-lg text-green-600">payments</span>
                                </div>
                            </div>

                            {/* Arrow 1 */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                            </div>

                            {/* Platform (Center) */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="size-14 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl text-gray-400">sync_alt</span>
                                </div>
                                <span className="text-[10px] font-medium text-gray-400 text-center leading-tight">Coordination<br />only</span>
                            </div>

                            {/* Arrow 2 */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                            </div>

                            {/* Person B */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-blue-600">person</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500">Member B</span>
                                <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-lg text-green-600">payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Slide 5: Animated Ledger showing money flow */}
                {step === 4 && (
                    <LedgerAnimation />
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

                    {/* SLIDE 1: Freedom starts with saving */}
                    {step === 0 && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white leading-tight">
                                Financial freedom starts with saving — <span className="text-primary">together.</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-xs mx-auto">
                                A trusted community helps you save toward real goals, without banks, debt, or interest.
                            </p>
                        </div>
                    )}

                    {/* SLIDE 2: How it works */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-gray-900 dark:text-white">
                                How it works
                            </h1>
                            <div className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-xs mx-auto space-y-2">
                                <p>Everyone contributes the same amount on a schedule.</p>
                                <p>Each round, one person receives the full group total.</p>
                                <p className="text-gray-400 dark:text-gray-500">Over time, everyone gets their turn — fairly and predictably.</p>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 3: Why save together */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
                                Why save together?
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-sm mx-auto mb-3">
                                Saving alone is hard.<br />
                                Saving together builds <span className="font-bold text-primary">consistency</span>, <span className="font-bold text-primary">accountability</span>, and <span className="font-bold text-primary">momentum</span>.
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                                You're more likely to reach your goals when others are committed with you.
                            </p>
                        </div>
                    )}

                    {/* SLIDE 4: Your Money, Your Control */}
                    {step === 3 && (
                        <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
                                Your money. Your control.
                            </h1>
                            <div className="flex flex-col gap-3 w-full">
                                {/* Card 1: Non-Custodial */}
                                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl flex gap-3 text-left animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150" style={{ animationFillMode: 'forwards' }}>
                                    <span className="material-symbols-outlined text-amber-600 shrink-0">info</span>
                                    <div>
                                        <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm">Non-custodial</h4>
                                        <p className="text-xs text-amber-800 dark:text-amber-300/80 leading-relaxed">
                                            This app <span className="underline">never holds your money</span>. Contributions happen directly between members using your preferred payment method.
                                        </p>
                                    </div>
                                </div>
                                {/* Card 2: Community Governed */}
                                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex gap-3 text-left animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300" style={{ animationFillMode: 'forwards' }}>
                                    <span className="material-symbols-outlined text-blue-500 shrink-0">visibility</span>
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-400 text-sm">Community governed</h4>
                                        <p className="text-xs text-blue-800 dark:text-blue-300/80 leading-relaxed">
                                            Circle coordinators verify contributions. Everything is transparent to the group.
                                        </p>
                                    </div>
                                </div>
                                {/* Quote */}
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic animate-in fade-in duration-700 delay-500" style={{ animationFillMode: 'forwards' }}>
                                    "You're not risking money — you're choosing when you receive it."
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SLIDE 5: Simple Math */}
                    {step === 4 && (
                        <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
                                Simple math. Fair by design.
                            </h1>
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 w-full shadow-sm">
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white">{membersValue}</span>
                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">members</span>
                                    </div>
                                    <div className="flex flex-col items-center border-x border-gray-200 dark:border-gray-700">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white">${monthlyValue}</span>
                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">monthly</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white">{monthsValue}</span>
                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">months</span>
                                    </div>
                                </div>
                                <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-4 animate-in slide-in-from-left duration-700 delay-500" style={{ animationFillMode: 'forwards' }}></div>
                                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 text-center">
                                    Each round, one member receives
                                </p>
                                <p className="text-center">
                                    <span className="font-black text-primary text-4xl animate-in zoom-in duration-500 delay-700" style={{ animationFillMode: 'forwards' }}>${savingsValue}</span>
                                    <span className="text-gray-600 dark:text-gray-400">.</span>
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-3 text-center leading-relaxed">
                                    By the end, everyone has received exactly what they contributed.<br />
                                    <span className="font-medium">No interest. No profit. Just timing.</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="w-full mt-auto pt-6">
                    <div className="flex gap-2 justify-center mb-6">
                        {[...Array(totalSteps)].map((_, i) => (
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
                                {step === totalSteps - 1 ? "Start exploring" : "Next"}
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
