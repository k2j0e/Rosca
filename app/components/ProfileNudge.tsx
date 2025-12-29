'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProfileNudgeProps {
    missingFields: string[];
}

export default function ProfileNudge({ missingFields }: ProfileNudgeProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible || missingFields.length === 0) return null;

    return (
        <div className="mx-5 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex items-start gap-3 relative">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-sm text-blue-900 dark:text-blue-100 mb-1">Build Trust</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-3 leading-relaxed">
                    Add your <span className="font-bold">{missingFields.join(' and ')}</span> to verify your identity and increase your Trust Score.
                </p>
                <Link href="#edit-profile" className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg inline-block hover:bg-blue-700 transition-colors">
                    Complete Profile
                </Link>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300"
            >
                <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
        </div>
    );
}
