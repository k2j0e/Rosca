"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { checkUserExistsAction, beginSignupAction, verifySignupOtpAction, completeSignupAction } from "@/app/actions";

type Step = 'phone' | 'otp' | 'profile';

function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState<Step>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(searchParams.get('error') === 'user_not_found' ? 'Account not found. Please sign up.' : '');

    // Form Data
    const [phone, setPhone] = useState(searchParams.get('phone') || '');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (searchParams.get('error')) {
            // Keep error visible
        }
    }, [searchParams]);

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const exists = await checkUserExistsAction(phone);
            if (exists) {
                setError('Account already exists. Please sign in.');
                setIsLoading(false);
                return;
            }

            const data = new FormData();
            data.set('phone', phone);
            data.set('name', name);

            const result = await beginSignupAction(data);
            if (result?.error) {
                setError(result.error);
            } else {
                setStep('otp');
            }
        } catch (err) {
            setError('Failed to connect. Please try again.');
        }
        setIsLoading(false);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.set('phone', phone);
            data.set('code', otp);

            const result = await verifySignupOtpAction(data);

            if (result?.error) {
                setError(result.error);
            } else {
                setStep('profile');
            }
        } catch (err) {
            setError('Verification failed.');
        }
        setIsLoading(false);
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-black font-display text-text-main dark:text-white">
            {/* Header */}
            <div className="flex items-center px-4 py-3 justify-between shrink-0 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-10">
                <Link href="/" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
                {step !== 'phone' && (
                    <div className="flex gap-1">
                        <div className="w-8 h-1 rounded-full bg-primary"></div> {/* Phone Step Indicator */}
                        <div className={`w-8 h-1 rounded-full ${step === 'otp' || step === 'profile' ? 'bg-primary' : 'bg-primary/30'}`}></div>
                        <div className={`w-8 h-1 rounded-full ${step === 'profile' ? 'bg-primary' : 'bg-primary/30'}`}></div>
                    </div>
                )}
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col flex-1 px-8 pt-6 pb-8">

                {/* STEP 1: PHONE */}
                {step === 'phone' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Get started</h1>
                        <p className="text-text-sub dark:text-text-sub-dark mb-10">Enter your mobile number to verify your identity.</p>

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
                                        onChange={(e) => { setPhone(e.target.value); setError(''); }}
                                        placeholder="(555) 000-0000"
                                        className={`flex-1 bg-gray-50 dark:bg-gray-900 border-2 ${error ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:font-normal`}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Full Name <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Amara Okafor"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                                />
                                <p className="text-[11px] text-gray-400">Real names build trust in financial circles.</p>
                                {error && (
                                    <p className="text-sm font-bold text-red-500 flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-sm">error</span>
                                        {error}
                                        <Link href="/signin" className="underline ml-1">Log In instead</Link>
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-gray-400 leading-snug">
                                By continuing, you agree to receive SMS for verification. Message and data rates may apply.
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading || phone.length < 10 || name.length < 2}
                                className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Continue"}
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 2: OTP */}
                {step === 'otp' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Verify number</h1>
                        <p className="text-text-sub dark:text-text-sub-dark mb-10">
                            We sent a code to <span className="font-bold text-text-main dark:text-white">+1 {phone}</span>.
                        </p>

                        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                                    placeholder="000000"
                                    className={`w-full bg-gray-50 dark:bg-gray-900 border-2 ${error ? 'border-red-400' : 'border-gray-100 dark:border-gray-800'} rounded-xl p-4 font-mono text-3xl tracking-[0.5em] text-center focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300`}
                                />
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mt-2">
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">error</span>
                                            {error}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setIsLoading(true);
                                        setError('');
                                        const data = new FormData();
                                        data.set('phone', phone);
                                        data.set('name', name);
                                        const result = await beginSignupAction(data);
                                        if (result?.error) {
                                            setError(result.error);
                                        } else {
                                            setError('');
                                            setOtp('');
                                            // Show success briefly
                                            setError('New code sent!');
                                            setTimeout(() => setError(''), 3000);
                                        }
                                        setIsLoading(false);
                                    }}
                                    disabled={isLoading}
                                    className="text-primary font-bold hover:underline disabled:opacity-50"
                                >
                                    Resend Code
                                </button>
                                <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    Change Number
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length < 6}
                                className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Verify Identity"}
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 3: PROFILE */}
                {step === 'profile' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Profile Setup</h1>
                        <p className="text-text-sub dark:text-text-sub-dark mb-8">How you'll appear to your circle.</p>

                        <form action={completeSignupAction} className="flex flex-col gap-6">
                            {/* Hidden inputs to carry over data from previous steps */}
                            <input type="hidden" name="phone" value={phone} />

                            {/* Photo Upload Mock */}
                            <div className="flex justify-center mb-2">
                                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <span className="material-symbols-outlined text-gray-400 text-3xl">add_a_photo</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Add Photo</span>
                                </div>
                            </div>

                            {/* Name input removed as it is collected in Step 1 */}

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Location <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                                <input
                                    type="text"
                                    name="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="City, Country"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-medium focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Complete Signup"}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function SignUpScreen() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpForm />
        </Suspense>
    );
}
