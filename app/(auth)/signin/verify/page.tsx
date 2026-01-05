
"use client";

import Link from "next/link";
import { verifyOtpAction, resendOtpAction } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useRef, useTransition } from "react";

function VerifyForm() {
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "";
    const email = searchParams.get("email") || "";
    const redirectUrl = searchParams.get("redirect") || "";

    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const isEmailVerification = !!email && !phone;
    const identifier = isEmailVerification ? email : phone;

    // Error messages
    const errorMap: Record<string, string> = {
        'invalid_code': 'Invalid or expired code. Please try again.',
        'invalid_code_format': 'Code must be 6 digits.',
        'resend_failed': 'Failed to resend code. Please try again.',
    };

    // Handle code input change
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(value);
        // Clear error when user starts typing
        if (error) setError(null);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (code.length !== 6) {
            setError('invalid_code_format');
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            if (isEmailVerification) {
                formData.append('email', email);
            } else {
                formData.append('phone', phone);
            }
            formData.append('code', code);
            if (redirectUrl) formData.append('redirect', redirectUrl);

            const result = await verifyOtpAction(formData);

            // If we get here with an error, show it and clear the code
            if (result?.error) {
                setError(result.error);
                setCode("");
                inputRef.current?.focus();
            }
            // If success, the action will redirect automatically
        });
    };

    // Handle resend code (only for phone - email uses redirect flow)
    const handleResendCode = async () => {
        if (isEmailVerification) {
            // For email, redirect back to signin to resend
            window.location.href = `/signin?method=email`;
            return;
        }

        setIsResending(true);
        setError(null);
        setResendSuccess(false);

        const formData = new FormData();
        formData.append('phone', phone);

        try {
            await resendOtpAction(formData);
            setResendSuccess(true);
            setCode("");
            inputRef.current?.focus();
            // Clear success message after 5 seconds
            setTimeout(() => setResendSuccess(false), 5000);
        } catch (e) {
            setError('resend_failed');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Verify {isEmailVerification ? 'email' : 'number'}</h1>
            <p className="text-text-sub dark:text-text-sub-dark mb-10">
                Enter the code sent to <span className="font-bold text-text-main dark:text-white">{identifier}</span>.
            </p>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 dark:border-red-900">
                    {errorMap[error] || 'Verification failed. Please try again.'}
                </div>
            )}

            {resendSuccess && (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 text-sm font-bold border border-green-100 dark:border-green-900">
                    New code sent! Check your {isEmailVerification ? 'inbox' : 'messages'}.
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Verification Code</label>
                    <input
                        ref={inputRef}
                        type="text"
                        id="otp-input"
                        maxLength={6}
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="123456"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        autoFocus
                        disabled={isPending}
                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-mono text-3xl tracking-[0.5em] text-center focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300 disabled:opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={code.length !== 6 || isPending}
                    className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Verifying...' : 'Verify'}
                </button>
            </form>

            {/* Resend Code Section */}
            <div className="mt-8 text-center">
                <p className="text-text-sub dark:text-text-sub-dark text-sm mb-2">Didn't receive the code?</p>
                <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending || isPending}
                    className="text-primary font-bold text-sm hover:underline disabled:opacity-50"
                >
                    {isResending ? 'Sending...' : 'Resend Code'}
                </button>
            </div>
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
