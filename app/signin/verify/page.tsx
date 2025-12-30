
"use client";

import Link from "next/link";
import { verifyOtpAction } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyForm() {
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "your phone";

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Verify number</h1>
            <p className="text-text-sub dark:text-text-sub-dark mb-10">
                Enter the code sent to <span className="font-bold text-text-main dark:text-white">{phone}</span>.
            </p>

            <form action={verifyOtpAction} className="flex flex-col gap-6">
                <input type="hidden" name="phone" value={phone} />
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Verification Code</label>
                    <input
                        type="text"
                        name="code"
                        required
                        maxLength={6}
                        placeholder="123456"
                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-mono text-3xl tracking-[0.5em] text-center focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30"
                >
                    Verify
                </button>
            </form>
        </div>
    );
}

export default function VerifyOtpScreen() {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-black font-display text-text-main dark:text-white">
            <div className="flex items-center px-4 py-3 justify-between shrink-0 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-10">
                <Link href="/signin" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
            </div>

            <div className="flex flex-col flex-1 px-8 pt-6 pb-8">
                <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
                    <VerifyForm />
                </Suspense>
            </div>
        </div>
    );
}
