"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAccountAction, checkUserExistsAction } from "@/app/actions";

// ... inside component ...
const [error, setError] = useState('');

// ... handlePhoneSubmit ...
const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        // Check if user exists
        const exists = await checkUserExistsAction(phone);
        if (exists) {
            setError("Account already exists. Please log in.");
            setIsLoading(false);
            return;
        }

        // Simulate sending SMS
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep('otp');
    } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
    }
};

// ... JSX ...
<input
    type="tel"
    required
    value={phone}
    onChange={(e) => { setPhone(e.target.value); setError(''); }}
    placeholder="(555) 000-0000"
    className={`flex-1 bg-gray-50 dark:bg-gray-900 border-2 ${error ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:font-normal`}
/>
                                </div >
    { error && (
        <p className="text-sm font-bold text-red-500 flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
            <Link href="/signin" className="underline ml-1">Log In instead</Link>
        </p>
    )}
                            </div >

                            <p className="text-xs text-gray-400 leading-snug">
                                By continuing, you agree to receive SMS for verification. Message and data rates may apply.
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading || phone.length < 10}
                                className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Continue"}
                            </button>
                        </form >
                    </div >
                )}

{/* STEP 2: OTP */ }
{
    step === 'otp' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Verify number</h1>
            <p className="text-text-sub dark:text-text-sub-dark mb-10">
                We send a code to <span className="font-bold text-text-main dark:text-white">+1 {phone}</span>.
            </p>

            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Verification Code</label>
                    <input
                        type="text"
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
                    disabled={isLoading || otp.length < 4}
                    className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Verify Identity"}
                </button>
            </form>
        </div>
    )
}

{/* STEP 3: PROFILE */ }
{
    step === 'profile' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Profile Setup</h1>
            <p className="text-text-sub dark:text-text-sub-dark mb-8">How you'll appear to your circle.</p>

            <form action={createAccountAction} className="flex flex-col gap-6">
                {/* Hidden inputs to carry over data from previous steps */}
                <input type="hidden" name="phone" value={phone} />

                {/* Photo Upload Mock */}
                <div className="flex justify-center mb-2">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <span className="material-symbols-outlined text-gray-400 text-3xl">add_a_photo</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Add Photo</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Full Name <span className="text-primary">*</span></label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Amara Okafor"
                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                    />
                    <p className="text-[11px] text-gray-400">Real names build trust in financial circles.</p>
                </div>

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
                    disabled={isLoading || name.length < 2}
                    className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Complete Signup"}
                </button>
            </form>
        </div>
    )
}

            </div >
        </div >
    );
}
