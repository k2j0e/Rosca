"use client";

import { useEffect, useState } from "react";

const TRADITIONS = [
    { name: 'Tandas', region: 'Latin America', icon: 'location_on', color: 'bg-green-100 dark:bg-green-900/30 text-green-700' },
    { name: 'Chit Funds', region: 'India', icon: 'temp_preferences_custom', color: 'bg-orange-100 dark:bg-orange-900/30 text-[#F25F15]' },
    { name: 'Ayuuto', region: 'Africa', icon: 'public', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' },
    { name: 'Susus', region: 'Caribbean', icon: 'wb_sunny', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' },
    { name: 'Stokvels', region: 'South Africa', icon: 'diversity_3', color: 'bg-red-100 dark:bg-red-900/30 text-red-700' },
    { name: 'Hui', region: 'Asia', icon: 'temple_buddhist', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700' },
];

export function TraditionsAnimation() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % TRADITIONS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">

            {/* Center Hub */}
            <div className="absolute z-10 text-center bg-white dark:bg-gray-900 rounded-full p-8 shadow-2xl border-4 border-[#F25F15] w-64 h-64 flex flex-col items-center justify-center transition-all duration-500">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${TRADITIONS[activeIndex].color}`}>
                    <span className="material-symbols-outlined text-3xl">
                        {TRADITIONS[activeIndex].icon}
                    </span>
                </div>
                <h3 className="text-2xl font-black mb-1 transition-all duration-500 scale-100 key={activeIndex}">
                    {TRADITIONS[activeIndex].name}
                </h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest transition-all duration-500">
                    {TRADITIONS[activeIndex].region}
                </p>

                {/* Connecting Lines to Active (Visual only, fading in/out) */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#F25F15]/30 animate-spin-slow pointer-events-none"></div>
            </div>

            {/* Satellites */}
            <div className="relative w-full h-full animate-spin-slow-custom">
                {TRADITIONS.map((item, i) => {
                    // Position items in a circle
                    const angle = (i * 360) / TRADITIONS.length; // degrees
                    const radius = 180; // Distance from center (px) - might need adjustment for mobile

                    // Convert polar to cartesian
                    // Note: We'll use CSS transforms for simpler rotation management in the future, 
                    // but for static positioning let's use style.
                    // Actually, to make them Orbit, we can just rotate the CONTAINER and counter-rotate the ITEMS.

                    return (
                        <div
                            key={i}
                            className={`
                                absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12
                                bg-white dark:bg-gray-800 rounded-full shadow-xl border-2 
                                flex flex-col items-center justify-center text-center p-2
                                transition-all duration-500
                                ${i === activeIndex ? 'scale-125 border-[#F25F15] z-20 ring-4 ring-[#F25F15]/20' : 'scale-90 border-gray-100 dark:border-gray-700 opacity-60 grayscale'}
                            `}
                            style={{
                                transform: `rotate(${angle}deg) translate(140px) rotate(-${angle}deg)` // Mobile radius
                            }}
                        >
                            <div className={`md:hidden flex flex-col items-center`}>
                                <span className="material-symbols-outlined text-xl mb-1">{item.icon}</span>
                                <span className="text-[10px] font-bold">{item.name}</span>
                            </div>

                            {/* Desktop only larger view override via media query styles effectively */}
                            <div className="hidden md:flex flex-col items-center">
                                <span className="material-symbols-outlined text-2xl mb-1">{item.icon}</span>
                                <span className="text-xs font-bold">{item.name}</span>
                            </div>
                        </div>
                    );
                })}


                {/* Larger Radius for Desktop - rendered separately to avoid complex media query math in inline styles */}
                <div className="hidden md:block absolute inset-0">
                    {TRADITIONS.map((item, i) => {
                        const angle = (i * 360) / TRADITIONS.length;
                        return (
                            <div
                                key={i}
                                className={`
                                    absolute top-1/2 left-1/2 w-32 h-32 -ml-16 -mt-16
                                    bg-white dark:bg-gray-800 rounded-full shadow-xl border-2 
                                    flex flex-col items-center justify-center text-center p-4
                                    transition-all duration-500
                                    ${i === activeIndex ? 'scale-110 border-[#F25F15] z-20 ring-4 ring-[#F25F15]/20 shadow-[#F25F15]/20' : 'scale-100 border-gray-100 dark:border-gray-700 opacity-70'}
                                `}
                                style={{
                                    transform: `rotate(${angle - 90}deg) translate(240px) rotate(-${angle - 90}deg)` // Desktop radius
                                }}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-50 dark:bg-white/5`}>
                                    <span className="material-symbols-outlined text-2xl text-gray-600 dark:text-gray-300">{item.icon}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Connecting Orbit Ring */}
            <div className="absolute w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full border-2 border-dashed border-[#F25F15]/20 pointer-events-none"></div>

        </div>
    );
}
