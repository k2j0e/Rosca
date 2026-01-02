"use client";

import { useEffect, useState, useRef } from "react";

const TRADITIONS = [
    { name: 'Tandas', region: 'Latin America', icon: 'location_on', color: 'text-green-600' },
    { name: 'Chit Funds', region: 'India', icon: 'temp_preferences_custom', color: 'text-[#F25F15]' },
    { name: 'Ayuuto', region: 'Africa', icon: 'public', color: 'text-blue-600' },
    { name: 'Susus', region: 'Caribbean', icon: 'wb_sunny', color: 'text-yellow-600' },
    { name: 'Stokvels', region: 'South Africa', icon: 'diversity_3', color: 'text-red-600' },
    { name: 'Hui', region: 'Asia', icon: 'temple_buddhist', color: 'text-purple-600' },
];

export function TraditionsAnimation() {
    const [rotation, setRotation] = useState(0);
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>();

    // Animation Loop
    const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        // const delta = time - startTimeRef.current;

        // Slow rotation: 1 degree every ~50ms? 
        // Let's just increment based on frames for smoothness, 
        // or easier: just use CSS animation for the rotation value if possible?
        // React state for 60fps might be heavy, but for 6 items it's fine.

        setRotation(prev => (prev + 0.2) % 360); // Speed of rotation
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, []);

    // Calculate Active Item (The one closest to "front" - 90 degrees in our circle math?)
    // Our positioning logic: 
    // angle = (index * 60) + rotation
    // "Front" is usually 90deg (bottom) or 270deg (top) depending on visual.
    // Let's say front is 90deg (bottom of ellipse).
    const getActiveIndex = () => {
        // Normalize rotation to 0-360
        // We want the item whose angle is closest to 90.
        // It's a bit complex with moving targets. 
        // Actually, let's just highlight the one visually at the front.

        // Simplified: The active item is the one with the highest 'y' value (scale).
        // Let's compute that during render.
        return -1; // computed in render
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto h-[500px] flex items-center justify-center overflow-visible perspective-[1000px]">

            {/* Center Hub (Fixed) */}
            {(() => {
                // Find the "front-most" item to display its details in center
                // We map to find max 'y' / scale.
                // Or just hardcode the "active" based on rotation buckets if needed.
                // Better: find the item closest to angle 90 (front).

                let activeItem = TRADITIONS[0];
                let minDist = 360;

                TRADITIONS.forEach((item, i) => {
                    const offsetAngle = (360 / TRADITIONS.length) * i;
                    const currentAngle = (rotation + offsetAngle) % 360;
                    // Distance to 90 (front)
                    let dist = Math.abs(currentAngle - 90);
                    if (dist > 180) dist = 360 - dist;

                    if (dist < minDist) {
                        minDist = dist;
                        activeItem = item;
                    }
                });

                return (
                    <div className="absolute z-0 text-center bg-white dark:bg-gray-900 rounded-full p-8 shadow-[0_0_40px_-10px_rgba(242,95,21,0.15)] border-4 border-[#F25F15]/10 w-56 h-56 flex flex-col items-center justify-center transition-all duration-300">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 bg-gray-50 dark:bg-white/5`}>
                            <span className={`material-symbols-outlined text-3xl ${activeItem.color}`}>
                                {activeItem.icon}
                            </span>
                        </div>
                        <h3 className="text-xl font-black mb-1 text-gray-900 dark:text-white">
                            {activeItem.name}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            {activeItem.region}
                        </p>
                    </div>
                );
            })()}

            {/* Orbit Path (Visual) */}
            {/* 3D Tilted Ring */}
            <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-dashed border-[#F25F15]/30 rounded-full pointer-events-none transform-style-3d rotate-x-[60deg]"></div>

            {/* Satellites */}
            {TRADITIONS.map((item, i) => {
                const offsetAngle = (360 / TRADITIONS.length) * i;
                const currentAngleDeg = (rotation + offsetAngle) % 360;
                const currentAngleRad = currentAngleDeg * (Math.PI / 180);

                // Ellipse parameters
                const radiusX = 225; // 450px width / 2
                const radiusY = 60;  // Compressed height for 3D effect

                // Calculate position
                const x = radiusX * Math.cos(currentAngleRad);
                const y = radiusY * Math.sin(currentAngleRad);

                // Calculate Scale/Z-index
                // y goes from -60 (back) to +60 (front). 
                // Scale range: 0.7 (max back) to 1.1 (max front)
                const scale = 0.7 + ((y + radiusY) / (2 * radiusY)) * 0.4;

                // Z-index: Front items higher
                const zIndex = Math.floor(y + 100);

                // Opacity: Fade back items slightly
                const opacity = 0.5 + ((y + radiusY) / (2 * radiusY)) * 0.5;

                // Check if "Active" (closest to front/90deg) for highlighting
                let dist = Math.abs(currentAngleDeg - 90);
                if (dist > 180) dist = 360 - dist;
                const isActive = dist < 20; // 20 degree threshold

                return (
                    <div
                        key={i}
                        className={`
                            absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10
                            bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 
                            flex flex-col items-center justify-center text-center
                            transition-shadow duration-300
                            ${isActive ? 'border-[#F25F15] shadow-[#F25F15]/30' : 'border-gray-100 dark:border-gray-700'}
                        `}
                        style={{
                            transform: `translate(${x}px, ${y}px) scale(${scale})`,
                            zIndex: zIndex,
                            opacity: opacity,
                        }}
                    >
                        <span className={`material-symbols-outlined text-2xl mb-0.5 ${item.color}`}>{item.icon}</span>
                        <span className={`text-[10px] font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{item.name}</span>
                    </div>
                );
            })}
        </div>
    );
}
