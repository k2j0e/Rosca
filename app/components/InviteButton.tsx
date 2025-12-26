"use client";

import { useState } from "react";

export default function InviteButton({ circleId, className, text }: { circleId: string, className?: string, text?: string }) {
    const [copied, setCopied] = useState(false);

    const handleInvite = () => {
        // In a real app this would be a full URL
        const inviteLink = `https://rosca.app/circles/${circleId}/join`;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (className) {
        return (
            <button
                onClick={handleInvite}
                className={className}
            >
                {copied ? "Link Copied!" : (text || "Share")}
            </button>
        );
    }

    return (
        <button
            onClick={handleInvite}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors"
        >
            <span className="material-symbols-outlined text-[16px]">
                {copied ? "check" : "person_add"}
            </span>
            <span className="text-xs font-bold uppercase tracking-wide">
                {copied ? "Link Copied" : "Invite"}
            </span>
        </button>
    );
}
