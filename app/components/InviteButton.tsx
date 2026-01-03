"use client";

import { useState } from "react";

export default function InviteButton({ circleId, className, text, circleName }: { circleId: string, className?: string, text?: string, circleName?: string }) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'shared'>('idle');

    const handleInvite = async () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const inviteLink = `${origin}/circles/${circleId}/join`;
        const shareData = {
            title: circleName ? `Join ${circleName} on Rosca` : 'Join my Savings Circle',
            text: 'I started a savings circle on Rosca. Check it out and join me!',
            url: inviteLink
        };

        // Try Native Share
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                setStatus('shared');
                setTimeout(() => setStatus('idle'), 2000);
                return;
            } catch (err) {
                // User cancelled or share failed, fallback to copy
                console.log('Share failed/cancelled, falling back to copy', err);
            }
        }

        // Fallback to Clipboard
        try {
            await navigator.clipboard.writeText(inviteLink);
            setStatus('copied');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (className) {
        return (
            <button
                onClick={handleInvite}
                className={className}
            >
                {status === 'copied' ? "Link Copied!" : status === 'shared' ? "Shared!" : (text || "Share")}
            </button>
        );
    }

    return (
        <button
            onClick={handleInvite}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors active:scale-95"
        >
            <span className="material-symbols-outlined text-[16px]">
                {status === 'copied' ? "check" : status === 'shared' ? "ios_share" : "person_add"}
            </span>
            <span className="text-xs font-bold uppercase tracking-wide">
                {status === 'copied' ? "Link Copied" : status === 'shared' ? "Shared" : "Invite"}
            </span>
        </button>
    );
}
