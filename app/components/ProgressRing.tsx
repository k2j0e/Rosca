"use client";

import React from 'react';

interface ProgressRingProps {
    current: number;
    total: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
    showLabel?: boolean;
}

export function ProgressRing({
    current,
    total,
    size = 56,
    strokeWidth = 4,
    color = "#2F7D6D",
    bgColor = "#E5E7EB",
    showLabel = true,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = total > 0 ? (current / total) * 100 : 0;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-text-main dark:text-white leading-none">
                        {current}/{total}
                    </span>
                </div>
            )}
        </div>
    );
}
