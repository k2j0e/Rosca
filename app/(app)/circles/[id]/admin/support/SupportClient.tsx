"use client";

import { useState } from "react";
import Link from "next/link";
import { escalateToSupportAction } from "@/app/actions";

interface SupportClientProps {
    circleId: string;
    circleName: string;
}

export default function SupportClient({ circleId, circleName }: SupportClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await escalateToSupportAction(circleId, subject, description);
            setSuccess(`Support case #${result.caseId} opened. Our team will review it shortly.`);
            setSubject("");
            setDescription("");
        } catch (err: any) {
            setError(err.message || "Failed to create support case");
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
                    Escalate to Support
                </h2>
                <div className="w-12"></div>
            </div>

            <div className="px-4 py-4">
                {/* Info */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">info</span>
                        <div>
                            <p className="font-bold text-blue-800 dark:text-blue-300 text-sm">When to escalate</p>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                Use this for disputes, fraud concerns, or issues you can't resolve with members directly.
                                Our team will review the full context of your circle.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl text-green-800 dark:text-green-300">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 shrink-0">check_circle</span>
                            <div>
                                <p className="font-bold text-sm">Case Created</p>
                                <p className="text-xs mt-1">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-sm">
                            <p className="text-text-sub dark:text-text-sub-dark">Circle:</p>
                            <p className="font-bold">{circleName}</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark mb-1 block">
                                Subject *
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. Member dispute about payment"
                                className="w-full bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-gray-800 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                                required
                                minLength={5}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark mb-1 block">
                                Description *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue in detail. Include names, dates, and any relevant context..."
                                rows={5}
                                className="w-full bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-gray-800 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors resize-none"
                                required
                                minLength={20}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Minimum 20 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || subject.length < 5 || description.length < 20}
                            className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">support_agent</span>
                                    Submit Support Case
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-400 text-center">
                            Our team typically responds within 24-48 hours.
                        </p>
                    </form>
                )}

                {success && (
                    <Link href={`/circles/${circleId}/admin`}>
                        <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all">
                            Back to Admin Dashboard
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}
