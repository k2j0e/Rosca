import Link from "next/link";
import { cookies } from "next/headers";

export default async function LandingPage() {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("session_user_id")?.value;

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-black dark:to-gray-900 font-display text-text-main dark:text-white overflow-x-hidden">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-gray-100 dark:border-white/5">
                <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link href="/" className="text-xl font-black tracking-tight text-primary">
                        Orbit
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors hidden sm:block">
                            How It Works
                        </Link>
                        {sessionUserId ? (
                            <Link
                                href="/explore"
                                className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:opacity-90 transition-all shadow-md shadow-primary/20"
                            >
                                Continue to App
                            </Link>
                        ) : (
                            <Link
                                href="/signin"
                                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white font-bold text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                Log In
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight animate-in slide-in-from-bottom-4 fade-in duration-700">
                        Save together.<br />
                        <span className="text-primary">Access cash.</span><br />
                        No interest.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                        A trusted circle helps each other reach goals — without banks or debt.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
                        <Link
                            href={sessionUserId ? "/explore" : "/signup"}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/30"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white font-bold text-lg rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                        >
                            See How It Works
                        </Link>
                    </div>
                </div>
            </main>

            {/* What This Is / Isn't Section */}
            <section className="py-16 px-6 bg-white dark:bg-gray-900/50 border-t border-gray-100 dark:border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-white">
                        What Orbit Is (and Isn't)
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* IS */}
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/50 rounded-2xl p-6">
                            <h3 className="font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                                What It Is
                            </h3>
                            <ul className="space-y-3 text-sm text-green-800 dark:text-green-300/90">
                                <li className="flex gap-2"><span className="font-bold">→</span> A coordination tool for trusted circles</li>
                                <li className="flex gap-2"><span className="font-bold">→</span> A modern take on traditional saving groups</li>
                                <li className="flex gap-2"><span className="font-bold">→</span> Your money, your control</li>
                            </ul>
                        </div>
                        {/* ISN'T */}
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 rounded-2xl p-6">
                            <h3 className="font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">cancel</span>
                                What It Isn't
                            </h3>
                            <ul className="space-y-3 text-sm text-red-800 dark:text-red-300/90">
                                <li className="flex gap-2"><span className="font-bold">✕</span> Not an investment (no yields)</li>
                                <li className="flex gap-2"><span className="font-bold">✕</span> Not a custodial wallet (we don't hold your money)</li>
                                <li className="flex gap-2"><span className="font-bold">✕</span> Not a bank or loan provider</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-white/5">
                <p>© {new Date().getFullYear()} Orbit. Built for communities, not profit.</p>
            </footer>
        </div>
    );
}
