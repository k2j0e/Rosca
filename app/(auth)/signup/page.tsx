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
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Common countries for dropdown
    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
        'France', 'Spain', 'Italy', 'Netherlands', 'Brazil', 'Mexico',
        'India', 'Japan', 'South Korea', 'Singapore', 'UAE', 'Saudi Arabia',
        'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt', 'Other'
    ];

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
            if (phone.length < 10 || phone.length > 15) {
                setError('Please enter a valid phone number (10-15 digits).');
                setIsLoading(false);
                return;
            }

            const exists = await checkUserExistsAction(phone);
            if (exists) {
                setError('Account already exists. Please sign in.');
                setIsLoading(false);
                return;
            }

            const data = new FormData();
            data.set('phone', phone);
            data.set('name', name);
            data.set('email', email);

            const result = await beginSignupAction(data);
            if (result?.error) {
                setError(result.error);
            } else {
                setStep('otp');
            }
        } catch (err) {
            console.error('[Signup Error]', err);
            const message = err instanceof Error ? err.message : 'Failed to connect. Please try again.';
            setError(message);
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
                                        {error.includes("already exists") && <Link href="/signin" className="underline ml-1">Log In instead</Link>}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Email <span className="text-gray-400 font-normal normal-case">(Backup login)</span></label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-medium focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                                />
                                <p className="text-[11px] text-gray-400">Optional backup method to receive login codes.</p>
                            </div>

                            <p className="text-xs text-gray-400 leading-snug">
                                By continuing, you agree to receive SMS for verification. Message and data rates may apply.
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading || phone.length < 10 || phone.length > 15 || name.length < 2}
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

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsLoading(true);
                            setError('');

                            const formData = new FormData(e.currentTarget);
                            const file = formData.get('avatar') as File;

                            if (file && file.size > 5 * 1024 * 1024) {
                                setError("Image too large. Please choose an image under 5MB.");
                                setIsLoading(false);
                                return;
                            }

                            try {
                                await completeSignupAction(formData);
                                // Redirect handles the rest, we stay loading until nav
                            } catch (err) {
                                console.error(err);
                                setError("Something went wrong. Please try again.");
                                setIsLoading(false);
                            }
                        }} className="flex flex-col gap-6">
                            {/* Hidden inputs to carry over data from previous steps */}
                            <input type="hidden" name="phone" value={phone} />
                            <input type="hidden" name="redirect" value={searchParams.get('redirect') || ''} />
                            <input type="hidden" name="location" value={city && country ? `${city}, ${country}` : city || country} />

                            {/* Photo Upload */}
                            <div className="flex justify-center mb-2">
                                <label className="cursor-pointer group">
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    <div className={`w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden
                                        ${avatarPreview
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}>
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-primary transition-colors">add_a_photo</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 group-hover:text-primary transition-colors">Add Photo</span>
                                            </>
                                        )}
                                    </div>
                                    {avatarPreview && (
                                        <p className="text-xs text-center text-primary font-medium mt-2">Tap to change</p>
                                    )}
                                </label>
                            </div>

                            {/* City Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">City <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g. Toronto"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-medium focus:outline-none focus:border-primary transition-colors placeholder:font-normal"
                                />
                            </div>

                            {/* Country Dropdown */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-text-sub dark:text-text-sub-dark">Country <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                                <select
                                    name="country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl p-4 font-medium focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">Select Country</option>
                                    {countries.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </p>
                                </div>
                            )}

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
