"use client";

import { useState } from "react";
import Link from "next/link";
import { postAnnouncementAction } from "@/app/actions";

interface AnnouncementsClientProps {
    circleId: string;
    announcements: Array<{
        id: string;
        title: string;
        body: string;
        isPinned: boolean;
        createdAt: Date;
    }>;
}

export default function AnnouncementsClient({ circleId, announcements }: AnnouncementsClientProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isPinned, setIsPinned] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await postAnnouncementAction(circleId, title, body, isPinned);
            setSuccess(true);
            setTitle("");
            setBody("");
            setIsPinned(false);
            setIsCreating(false);
            // Page will revalidate
        } catch (err: any) {
            setError(err.message || "Failed to post announcement");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display pb-20">
            {/* TopAppBar */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <Link href={`/circles/${circleId}/admin`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Announcements
                </h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px] text-primary">
                        {isCreating ? 'close' : 'add'}
                    </span>
                </button>
            </div>

            <div className="px-4 py-4">
                {/* Success Toast */}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-300 text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Announcement posted successfully!
                    </div>
                )}

                {/* Create Form */}
                {isCreating && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h3 className="font-bold mb-4">New Announcement</h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark mb-1 block">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Payment Reminder"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    minLength={3}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark mb-1 block">
                                    Message *
                                </label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Write your announcement here..."
                                    rows={4}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors resize-none"
                                    required
                                    minLength={10}
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm">Pin this announcement</span>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading || title.length < 3 || body.length < 10}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">send</span>
                                        Post Announcement
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-3 text-center">
                            Max 3 announcements per day
                        </p>
                    </form>
                )}

                {/* Announcements List */}
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-3">
                    {announcements.length > 0 ? 'Posted Announcements' : 'No Announcements Yet'}
                </h3>

                {announcements.length === 0 && !isCreating && (
                    <div className="text-center py-8 text-text-sub dark:text-text-sub-dark">
                        <span className="material-symbols-outlined text-4xl mb-2">campaign</span>
                        <p>Post your first announcement to keep members informed.</p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="mt-4 px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm"
                        >
                            Create Announcement
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    {announcements.map(a => (
                        <div
                            key={a.id}
                            className={`p-4 rounded-2xl ${a.isPinned
                                    ? 'bg-primary/10 border-2 border-primary/20'
                                    : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5'
                                }`}
                        >
                            <div className="flex items-start gap-2">
                                {a.isPinned && (
                                    <span className="material-symbols-outlined text-primary text-lg shrink-0">push_pin</span>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-bold">{a.title}</h4>
                                    <p className="text-sm text-text-sub dark:text-text-sub-dark mt-1 whitespace-pre-wrap">{a.body}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(a.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
