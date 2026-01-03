"use client";
import { useState, useEffect } from "react";

export default function ShareLinkDisplay({ circleId }: { circleId: string }) {
    const [origin, setOrigin] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const shareUrl = `${origin}/invite/${circleId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!origin) return null; // Hydration gap

    return (
        <div className="mt-4">
            <label className="text-[10px] font-bold text-white/60 mb-1.5 block uppercase tracking-wide">
                Share Link
            </label>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-1.5 pl-3 flex items-center gap-2 border border-white/10 group overflow-hidden">
                <span className="text-xs text-white/90 truncate flex-1 font-mono selection:bg-white/30">
                    {shareUrl}
                </span>
                <button
                    onClick={handleCopy}
                    className="shrink-0 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                    title="Copy Link"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {copied ? "check" : "content_copy"}
                    </span>
                </button>
            </div>
            {copied && (
                <span className="text-[10px] text-white/80 mt-1 block animate-in fade-in slide-in-from-top-1">
                    Copied to clipboard!
                </span>
            )}
        </div>
    );
}
