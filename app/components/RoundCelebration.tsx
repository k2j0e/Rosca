"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RoundCelebrationProps {
    currentRound: number;
    latestEvent?: {
        type: string;
        timestamp: Date | string;
    };
}

export default function RoundCelebration({ currentRound, latestEvent }: RoundCelebrationProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!latestEvent) return;

        const isRoundStart = latestEvent.type === 'round_start';
        const isRecent = new Date().getTime() - new Date(latestEvent.timestamp).getTime() < 1000 * 60; // Within last minute
        const hasSeen = localStorage.getItem(`seen_round_${currentRound}_celebration`);

        if (isRoundStart && isRecent && !hasSeen) {
            setShow(true);
            localStorage.setItem(`seen_round_${currentRound}_celebration`, 'true');
        }
    }, [latestEvent, currentRound]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center relative overflow-hidden animate-in zoom-in-90 duration-500">
                {/* Confetti Background (CSS) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={`absolute w-2 h-2 rounded-full animate-ping opacity-75`}
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                backgroundColor: ['#FFC107', '#2196F3', '#4CAF50', '#F44336'][Math.floor(Math.random() * 4)],
                                animationDuration: `${1 + Math.random()}s`,
                                animationDelay: `${Math.random()}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <span className="material-symbols-outlined text-4xl text-amber-600">trophy</span>
                    </div>

                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mb-2">
                        Round {currentRound}
                    </h2>
                    <p className="text-xl font-bold text-text-main dark:text-white mb-4">
                        Has Officially Started!
                    </p>
                    <p className="text-text-sub dark:text-text-sub-dark mb-8">
                        Great job completing the previous round. Let's keep the momentum going!
                    </p>

                    <button
                        onClick={() => setShow(false)}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                    >
                        Let's Go!
                    </button>
                </div>
            </div>
        </div>
    );
}
