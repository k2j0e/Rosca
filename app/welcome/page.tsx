import Link from "next/link";
import Image from "next/image";

export default function WelcomeScreen() {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-black font-display text-text-main dark:text-white">

            {/* Hero Section */}
            <div className="relative w-full h-[45vh] bg-gray-100">
                <Image
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Community Circle"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>

                {/* Admin Governed Badge - Floating */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500 text-xl">verified_user</span>
                    <span className="text-xs font-bold tracking-wide uppercase text-gray-800 dark:text-gray-200">Admin Governed</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 px-6 pt-4 pb-8 items-center text-center">

                <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">
                    Welcome to <br />
                    <span className="text-primary">Your Circle</span>
                </h1>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xs mx-auto">
                    Fair, interest-free financing powered by people you trust.
                </p>

                {/* Value Cards */}
                <div className="w-full flex flex-col gap-4 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm text-left flex gap-4 items-start">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full shrink-0 text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-2xl">payments</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Get Funds Early</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                                Need liquidity now? Receive the community pot early in the cycle for your goals.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm text-left flex gap-4 items-start">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full shrink-0 text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Save & Support</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                                Wait for your turn later to help the group. Earn trust & rewards for acting as a lender.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pagination Dots (Visual Only) */}
                <div className="flex gap-2 justify-center mb-8">
                    <div className="w-8 h-1.5 bg-primary rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>

                {/* CTA Button */}
                <div className="w-full mt-auto">
                    <Link href="/signup">
                        <button className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
                            Join the Community
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </Link>

                    <Link href="/signin">
                        <button className="w-full mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                            I already have an account
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
