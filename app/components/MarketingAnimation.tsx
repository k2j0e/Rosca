"use client";

import { useEffect, useState } from "react";

export function MarketingAnimation() {
    const [step, setStep] = useState(0); // 0: Idle, 1: Contributing, 2: Pooled, 3: Payout
    const [month, setMonth] = useState(1);
    const TOTAL_MONTHS = 3;

    useEffect(() => {
        const cycle = async () => {
            // 1. Start Contribution
            setStep(1);
            await new Promise(r => setTimeout(r, 1500)); // contributing animation time

            // 2. Pool Collected
            setStep(2);
            await new Promise(r => setTimeout(r, 800)); // pause at full pool

            // 3. Payout
            setStep(3);
            await new Promise(r => setTimeout(r, 2000)); // celebration time

            // 4. Reset / Next Month
            setStep(0);
            await new Promise(r => setTimeout(r, 500));

            setMonth(prev => prev >= TOTAL_MONTHS ? 1 : prev + 1);
        };

        const interval = setInterval(cycle, 5000);
        cycle(); // Start immediately

        return () => clearInterval(interval);
    }, []);

    const getPersonOffset = (index: number) => {
        // Position 3 people in a circle/triangle
        // 0: Top, 1: Bottom Right, 2: Bottom Left
        if (index === 0) return "top-0 left-1/2 -translate-x-1/2";
        if (index === 1) return "bottom-0 right-0";
        if (index === 2) return "bottom-0 left-0";
        return "";
    };

    const isWinner = (index: number) => (index + 1) === month;

    return (
        <div className="relative w-full max-w-md mx-auto aspect-square bg-gray-50/50 dark:bg-white/5 rounded-full border-2 border-dashed border-gray-200 dark:border-white/10 p-8 flex items-center justify-center my-12 md:my-0">

            {/* Center Pot */}
            <div className={`relative z-10 w-32 h-32 rounded-full bg-white dark:bg-gray-900 border-4 border-[#F25F15] flex items-center justify-center shadow-2xl transition-all duration-500 ${step >= 2 ? 'scale-110 shadow-[#F25F15]/40' : 'scale-100'}`}>
                <div className="text-center">
                    <span className={`material-symbols-outlined text-4xl text-[#F25F15] transition-all duration-500 ${step >= 2 ? 'scale-125' : ''}`}>savings</span>
                    <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        {step >= 2 ? "$3,000" : "$0"}
                    </div>
                </div>
            </div>

            {/* People */}
            {[0, 1, 2].map((i) => (
                <div key={i} className={`absolute ${getPersonOffset(i)} w-20 h-20`}>
                    <div className={`
                        relative w-full h-full rounded-full bg-white dark:bg-gray-800 border-2 flex items-center justify-center shadow-lg transition-all duration-500 z-10
                        ${isWinner(i) && step === 3 ? 'border-[#F25F15] scale-110 bg-orange-50 dark:bg-orange-900/20 ring-4 ring-[#F25F15]/20' : 'border-gray-200 dark:border-gray-700'}
                    `}>
                        <span className={`material-symbols-outlined text-3xl ${isWinner(i) && step === 3 ? 'text-[#F25F15] animate-bounce' : 'text-gray-400'}`}>
                            {isWinner(i) && step === 3 ? 'sentiment_very_satisfied' : 'person'}
                        </span>

                        {/* Name Label */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-500">
                            {i === 0 ? 'Alex' : i === 1 ? 'Sam' : 'Jordan'}
                        </div>

                        {/* Winner Badge */}
                        {isWinner(i) && step === 3 && (
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#F25F15] rounded-full text-white flex items-center justify-center shadow-lg animate-bounce z-20">
                                <span className="material-symbols-outlined text-sm">check</span>
                            </div>
                        )}
                    </div>

                    {/* Contribution Coin Animation */}
                    <div className={`
                        absolute top-1/2 left-1/2 w-8 h-8 bg-[#F25F15] rounded-full text-white flex items-center justify-center font-bold shadow-sm z-20
                        transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1) opacity-0
                        ${step === 1 ? 'opacity-100' : ''}
                    `}
                        style={{
                            transform: step === 1
                                /* Move TOWARDS Center (Manual offset based on container ~350px) */
                                ? (i === 0 ? 'translate(-50%, 100px) scale(0)' : i === 1 ? 'translate(-100px, -60px) scale(0)' : 'translate(60px, -60px) scale(0)')
                                /* Start AT Person */
                                : 'translate(-50%, -50%) scale(1)',
                        }}
                    >
                        <span className="text-xs">$</span>
                    </div>

                    {/* Payout Animation (From Center TO Winner) */}
                    <div className={`
                        absolute top-1/2 left-1/2 w-12 h-12 bg-green-500 rounded-full text-white flex items-center justify-center font-bold shadow-sm z-20
                        transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1) opacity-0
                        ${step === 3 && isWinner(i) ? 'opacity-100 delay-200' : ''}
                    `}
                        style={{
                            transform: step === 3 && isWinner(i)
                                /* Move FROM Center TO Person */
                                ? 'translate(-50%, -50%) scale(1)' /* End at Person - centered */

                                /* Start AT Center (Simulated by reversing the vector from person towards center?) 
                                   No, since the DIV is inside the Person Div, 
                                   'translate(0,0)' is at Person.
                                   So we want to Start at Center (Relative to Person).
                                   Center is roughly opposite of the contribution vectors.
                                */
                                : (i === 0 ? 'translate(-50%, 100px) scale(0)' : i === 1 ? 'translate(-100px, -60px) scale(0)' : 'translate(60px, -60px) scale(0)')
                        }}
                    >
                        <span className="material-symbols-outlined text-lg">attach_money</span>
                    </div>
                </div>
            ))}

            {/* Connection Lines (Static SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-20">
                <circle cx="50%" cy="50%" r="35%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-gray-400" />
            </svg>

            {/* Status Text (Bottom) */}
            <div className="absolute -bottom-24 w-full text-center">
                <div className="text-[#F25F15] font-bold text-xl mb-1">Month {month}</div>
                <div className="text-gray-500 h-6">
                    {step === 0 && "Waiting for contributions..."}
                    {step === 1 && "Everyone contributes $1,000"}
                    {step === 2 && "The pool reaches $3,000"}
                    {step === 3 && `${month === 1 ? 'Alex' : month === 2 ? 'Sam' : 'Jordan'} receives the full $3,000!`}
                </div>
            </div>
        </div>
    );
}
