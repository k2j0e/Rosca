"use strict";

"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
    className = "",
    icon = "arrow_back",
    fallbackPath = "/"
}: {
    className?: string;
    icon?: string;
    fallbackPath?: string;
}) {
    const router = useRouter();

    const handleBack = () => {
        // Safe navigation logic to prevent cycles
        if (window.history.length > 2) {
            router.back();
        } else {
            router.push(fallbackPath);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`flex items-center justify-center transition-colors cursor-pointer hover:opacity-70 ${className}`}
            title="Go Back"
        >
            <span className="material-symbols-outlined text-[24px]">
                {icon}
            </span>
        </button>
    );
}
