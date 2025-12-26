"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInAction } from "@/app/actions";

type Step = 'phone' | 'otp';

export default function SignInScreen() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate sending SMS
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep('otp');
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate verify OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/");
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-black font-display text-text-main dark:text-white">
            {/* Header */}
            <div className="flex items-center px-4 py-3 justify-between shrink-0 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-10">
                <Link href="/welcome" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
            </div>

            <div className="flex flex-col flex-1 px-8 pt-6 pb-8">

                {step === 'phone' ? (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h1>
                        <p className="text-text-sub dark:text-text-sub-dark mb-10">Sign in with your phone number.</p>

                        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Mobile Number</label>
                                <div className="flex gap-3">
                                    <div className="w-20 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-center font-bold text-gray-500">
                                        +1
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="(555) 000-0000"
                                        className="flex-1 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || phone.length < 10}
                                className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Send Code"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Verify number</h1>
                        <p className="text-text-sub dark:text-text-sub-dark mb-10">
                            Enter the code sent to <span className="font-bold text-text-main dark:text-white">+1 {phone}</span>.
                        </p>

                        <form action={signInAction} className="flex flex-col gap-6">
                            <input type="hidden" name="phone" value={phone} />
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Verification Code</label>
                                <input
                                    type="text"
                                    name="otp"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="0000"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-mono text-3xl tracking-[0.5em] text-center focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Didn't receive it?</span>
                                <button type="button" className="text-primary font-bold hover:underline">Resend Code</button>
                            </div>

                            <button
                                type="submit"
                                disabled={otp.length < 4}
                                className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                )}

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
