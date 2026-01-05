"use client";

import Link from "next/link";
import { sendOtpAction, sendEmailOtpAction } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type LoginMethod = 'phone' | 'email';

function SignInForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const redirectUrl = searchParams.get("redirect");
    const [method, setMethod] = useState<LoginMethod>('phone');

    const errorMap: Record<string, string> = {
        'invalid_phone': 'Invalid phone number format.',
        'invalid_email': 'Invalid email format.',
        'user_not_found': 'Account not found. Please create an account.',
        'email_not_found': 'No account found with this email.',
        'account_exists': 'Account already exists. Please sign in.',
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h1>
            <p className="text-text-sub dark:text-text-sub-dark mb-6">Sign in to continue.</p>

            {/* Method Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 mb-8">
                <button
                    type="button"
                    onClick={() => setMethod('phone')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${method === 'phone'
                        ? 'bg-white dark:bg-gray-800 text-text-main dark:text-white shadow-sm'
                        : 'text-text-sub dark:text-text-sub-dark'
                        }`}
                >
                    Phone
                </button>
                <button
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${method === 'email'
                        ? 'bg-white dark:bg-gray-800 text-text-main dark:text-white shadow-sm'
                        : 'text-text-sub dark:text-text-sub-dark'
                        }`}
                >
                    Email
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 dark:border-red-900">
                    {errorMap[error] || decodeURIComponent(error)}
                </div>
            )}

            {method === 'phone' ? (
                <form action={sendOtpAction} className="flex flex-col gap-6">
                    {redirectUrl && <input type="hidden" name="redirect" value={redirectUrl} />}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Mobile Number</label>
                        <div className="flex gap-3">
                            <div className="w-20 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-center font-bold text-gray-500">
                                +1
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="(555) 000-0000"
                                className="flex-1 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30"
                    >
                        Send Code
                    </button>
                </form>
            ) : (
                <form action={sendEmailOtpAction} className="flex flex-col gap-6">
                    {redirectUrl && <input type="hidden" name="redirect" value={redirectUrl} />}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                        />
                        <p className="text-[11px] text-gray-400">We'll send a verification code to this email.</p>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30"
                    >
                        Send Code
                    </button>
                </form>
            )}
        </div>
    );
}

export default function SignInScreen() {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-black font-display text-text-main dark:text-white">
            {/* Header */}
            <div className="flex items-center px-4 py-3 justify-between shrink-0 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-10">
                <Link href="/" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
            </div>

            <div className="flex flex-col flex-1 px-8 pt-6 pb-8">
                <Suspense fallback={<div>Loading form...</div>}>
                    <SignInForm />
                </Suspense>

                <div className="mt-auto pt-8 text-center">
                    <p className="text-text-sub dark:text-text-sub-dark text-sm">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary font-bold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
