import Link from "next/link";
import { cookies } from "next/headers";

export default async function LandingPage() {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("session_user_id")?.value;
    const isLoggedIn = !!sessionUserId;

    return (
        <div className="flex min-h-screen flex-col font-display bg-white dark:bg-gray-950 text-text-main dark:text-white overflow-x-hidden">

            {/* 1. Navigation */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full border-[3px] border-primary flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-xl font-black tracking-tight text-text-main dark:text-white">Orbit</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors hidden sm:block">
                            How it Works
                        </Link>
                        {isLoggedIn ? (
                            <Link href="/home">
                                <button className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Go to Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link href="/signup">
                                <button className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Get Started
                                </button>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">

                {/* 2. Hero Section */}
                <section className="pt-20 pb-24 px-6 text-center">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                            Save Together.<br />
                            <span className="text-primary">Access Cash.</span><br />
                            No Interest.
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                            Join a savings circle. Reach your goals faster without banks or debt. The modern way to save with your community.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link href={isLoggedIn ? "/home" : "/signup"} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]">
                                    Start Saving Now
                                </button>
                            </Link>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2">
                                <span className="material-symbols-outlined text-green-500 fill-1">check_circle</span>
                                No fees to join
                            </div>
                        </div>

                        {/* Hero Visual / Cycle Graphic Stub */}
                        <div className="mt-20 relative w-full max-w-2xl aspect-[4/3] sm:aspect-[16/9] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-3xl border border-gray-100 dark:border-white/5 p-8 flex items-center justify-center overflow-hidden">
                            {/* Abstract Orbit Visual */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <div className="w-[500px] h-[500px] border border-primary/20 rounded-full animate-spin-slow-reverse" style={{ animationDuration: '30s' }}></div>
                                <div className="absolute w-[350px] h-[350px] border border-primary/40 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }}></div>
                                <div className="absolute w-[200px] h-[200px] border border-primary/60 rounded-full"></div>
                            </div>

                            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 p-6 flex items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="text-center">
                                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Pot Value</p>
                                    <p className="text-4xl font-black text-text-main dark:text-white">$1,000</p>
                                </div>
                                <div className="h-10 w-px bg-gray-100 dark:bg-gray-800"></div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold">
                                            {i === 4 ? '+' : ''}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Benefits Section */}
                <section className="py-20 px-6 bg-gray-50 dark:bg-white/5">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Benefits</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold">Why Choose Orbit?</h2>
                            <p className="text-gray-500 mt-4">Built on trust, powered by community.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: 'verified_user', title: 'Transparent & Secure', desc: 'Your funds are protected with bank-grade security. No hidden fees.' },
                                { icon: 'groups', title: 'Community-Driven', desc: 'Connect with verified members. Save together and support each other.' },
                                { icon: 'percent', title: 'Interest-Free', desc: 'Forget high interest rates. Pay a small flat membership fee and keep your cash.' },
                                { icon: 'bolt', title: 'Fast Access', desc: 'Get verified in minutes. Receive your payout instantly when it’s your turn.' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-primary mb-6">
                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Trust / Dark Stats Section */}
                <section className="py-20 px-6 bg-gray-900 text-white rounded-[2.5rem] my-10 max-w-[95%] mx-auto relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                            <div className="max-w-md">
                                <h2 className="text-4xl font-black mb-6">Built on Trust</h2>
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">200k+</p>
                                        <p className="text-gray-400 font-medium mt-1">Active Members</p>
                                    </div>
                                    <div>
                                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">$350M+</p>
                                        <p className="text-gray-400 font-medium mt-1">Total Saved</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined fill-1 text-lg">star</span>)}
                                </div>
                                <p className="text-xl font-medium leading-relaxed mb-6">"Orbit helped me start a small business. I used my payout to buy inventory without paying interest to a bank. It felt like family helping family."</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"></div>
                                    <div>
                                        <p className="font-bold">Adira K.</p>
                                        <p className="text-sm text-gray-400">Ghana</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. How It Works */}
                <section id="how-it-works" className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-center mb-16">How Orbit Works</h2>

                        <div className="relative">
                            {/* Vertical Line for Desktop/Mobile */}
                            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800 -translate-x-1/2 hidden md:block"></div>

                            <div className="space-y-12 relative">
                                {[
                                    { step: 1, title: 'Join a Circle', desc: 'Find a circle that matches your savings goal and monthly budget.' },
                                    { step: 2, title: 'Contribute Monthly', desc: 'Pay your fixed monthly contribution easily via the app.' },
                                    { step: 3, title: 'Receive Cash', desc: 'When it’s your turn, receive the total lump sum. No interest, no debt.' }
                                ].map((step, i) => (
                                    <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                                        {/* Step Number Circle */}
                                        <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800 flex items-center justify-center z-10 shrink-0 shadow-lg">
                                            <span className="font-black text-2xl text-primary">{step.step}</span>
                                        </div>

                                        {/* Content */}
                                        <div className={`bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl flex-1 text-center ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                            <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                                            <p className="text-gray-500">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Social Proof / Cards */}
                <section className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-50 dark:to-white/5">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/20">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-6">
                                    <span className="material-symbols-outlined">money_off</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-red-900 dark:text-red-200">Traditional Loans</h3>
                                <p className="text-sm text-red-800/70 dark:text-red-300">Hidden fees, high interest rates, and impersonal service. Often leaves you with more debt than you started with.</p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-3xl border border-green-100 dark:border-green-900/20 relative">
                                <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">Rated 4.9/5.0</div>
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-6">
                                    <span className="material-symbols-outlined">thumb_up</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-green-900 dark:text-green-200">Member Ratings</h3>
                                <p className="text-sm text-green-800/70 dark:text-green-300">Transparent profiles help you save with people you can trust. Our community vetting process ensures safety.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Bottom CTA */}
                <section className="py-24 px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl font-extrabold mb-8">Ready to start saving?</h2>
                        <p className="text-gray-500 mb-10 text-lg">Create your account in minutes and join your first circle today.</p>
                        <Link href="/signup">
                            <button className="px-10 py-5 bg-primary text-white font-bold text-xl rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/30">
                                Create Free Account
                            </button>
                        </Link>
                        <div className="mt-8 text-sm text-gray-400">
                            No credit card required • Cancel anytime
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-primary">Orbit</span>
                            </div>
                            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Orbit Financial Technologies.<br />All rights reserved.</p>
                        </div>

                        <div className="flex gap-8 text-sm font-medium text-gray-500">
                            <Link href="#" className="hover:text-primary transition-colors">About</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Safety</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                        </div>

                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-primary transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-lg">public</span>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-primary transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-lg">mail</span>
                            </button>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}
