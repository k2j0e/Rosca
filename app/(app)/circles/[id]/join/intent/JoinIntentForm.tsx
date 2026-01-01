"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinCircleJsonAction } from "@/app/actions";

interface JoinIntentFormProps {
    circleId: string;
    circleName: string;
}

export function JoinIntentForm({ circleId, circleName }: JoinIntentFormProps) {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    async function handleSubmit(formData: FormData) {
        if (status !== 'idle') return;

        setStatus('submitting');

        // Artificial delay for "Lock In" feel ? No, let's just let the network do it, 
        // effectively minimal delay is good.
        // But visual transition needs at least enough time to render Spinner.

        const result = await joinCircleJsonAction(formData);

        if (result?.success) {
            setStatus('success');
            // Wait for Checkmark animation to register
            setTimeout(() => {
                router.push("/explore?joined=true");
            }, 1000);
        } else {
            // Handle error (alert for now, ideal: toast)
            alert("Failed to join: " + (result?.error || "Unknown error"));
            setStatus('idle');
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col flex-1">
            <input type="hidden" name="circleId" value={circleId} />

            {/* Intent TextArea */}
            <div className="relative mb-8">
                <textarea
                    name="intent"
                    className="w-full h-32 bg-white dark:bg-surface-dark border-2 border-gray-200 dark:border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-300 dark:placeholder:text-white/20 shadow-sm"
                    placeholder="e.g. I want to save for my daughter's tuition..."
                ></textarea>
            </div>

            {/* Payout Preference */}
            <div className="mb-6">
                <label className="block text-text-main dark:text-white font-bold mb-3 text-lg">
                    Payout Timing Preference
                </label>
                <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all cursor-pointer">
                        <input type="radio" name="preference" value="early" className="w-5 h-5 accent-primary" />
                        <div className="ml-3">
                            <span className="block font-bold text-text-main dark:text-white">Early</span>
                            <span className="text-sm text-text-sub dark:text-text-sub-dark">I need funds sooner (e.g. for an upcoming event).</span>
                        </div>
                    </label>
                    <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all cursor-pointer">
                        <input type="radio" name="preference" value="late" className="w-5 h-5 accent-primary" />
                        <div className="ml-3">
                            <span className="block font-bold text-text-main dark:text-white">Late</span>
                            <span className="text-sm text-text-sub dark:text-text-sub-dark">I want to use this as savings/investment.</span>
                        </div>
                    </label>
                    <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all cursor-pointer">
                        <input type="radio" name="preference" value="any" defaultChecked className="w-5 h-5 accent-primary" />
                        <div className="ml-3">
                            <span className="block font-bold text-text-main dark:text-white">Any / Flexible</span>
                            <span className="text-sm text-text-sub dark:text-text-sub-dark">No specific preference.</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Privacy Note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/10 mb-auto">
                <span className="material-symbols-outlined text-orange-500 mt-0.5">visibility</span>
                <p className="text-sm text-text-sub dark:text-text-sub-dark leading-snug">
                    This will be shared with the circle admin and members to build trust.
                </p>
            </div>

            {/* Liability Acknowledgement - Mandatory */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <label className="flex gap-3 items-start cursor-pointer group">
                    <input
                        type="checkbox"
                        required
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <p className="text-sm text-text-main dark:text-white leading-snug">
                        I understand that members who receive funds earlier are supported by the group, and members who receive funds later are supporting the group.
                    </p>
                </label>
            </div>

            {/* Footer Actions */}
            <div className="mt-auto pt-6 flex flex-col gap-3 pb-6">
                <button
                    type="submit"
                    disabled={status !== 'idle'}
                    className={`
                        w-full h-14 font-bold text-lg rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-300
                        ${status === 'success' ? 'bg-green-600 text-white shadow-green-600/30' : 'bg-primary text-white shadow-primary/30 hover:opacity-90 active:scale-[0.98]'}
                        ${status === 'submitting' ? 'animate-lock-in opacity-90' : ''}
                    `}
                >
                    {status === 'idle' && (
                        <>
                            Finish & Go to Dashboard
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </>
                    )}
                    {status === 'submitting' && (
                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    )}
                    {status === 'success' && (
                        <>
                            <span className="material-symbols-outlined animate-in zoom-in spin-in-90 duration-300 text-2xl">check_circle</span>
                            <span>Locked In!</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="w-full py-3 text-text-sub dark:text-text-sub-dark font-bold hover:text-text-main dark:hover:text-white transition-colors"
                >
                    Skip for now
                </button>
            </div>
        </form>
    );
}
