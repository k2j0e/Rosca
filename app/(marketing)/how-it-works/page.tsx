import Link from "next/link";

export default function HowItWorksPage() {
    const steps = [
        {
            number: 1,
            title: "Join a Savings Circle",
            description: "Find a group of trusted people who share a savings goal. Each circle has 5-12 members and runs for a set period.",
            icon: "groups",
            color: "blue"
        },
        {
            number: 2,
            title: "Everyone Contributes Equally",
            description: "Each month, every member contributes the same amount. For example, 10 people × $100 = $1,000 pot.",
            icon: "payments",
            color: "purple"
        },
        {
            number: 3,
            title: "One Person Gets the Pot",
            description: "Each month, one member receives the full pot. By the end, everyone has received exactly what they put in.",
            icon: "savings",
            color: "green"
        }
    ];

    const benefits = [
        { icon: "lock", title: "No Interest", description: "Unlike loans, you pay back exactly what you receive. No fees, no interest." },
        { icon: "visibility", title: "Transparent", description: "Every contribution and payout is visible to all circle members." },
        { icon: "account_balance_wallet", title: "Non-Custodial", description: "We never hold your money. Payments happen directly between members." },
        { icon: "diversity_3", title: "Community-Driven", description: "Circles are governed by their members. Admins approve who joins." }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-black dark:to-gray-900 font-display text-text-main dark:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-gray-100 dark:border-white/5">
                <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link href="/" className="text-xl font-black tracking-tight text-primary">
                        Orbit
                    </Link>
                    <Link
                        href="/signup"
                        className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:opacity-90 transition-all shadow-md shadow-primary/20"
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 px-6 text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                    How <span className="text-primary">Orbit</span> Works
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    A modern take on the age-old tradition of community savings circles (ROSCAs).
                </p>
            </section>

            {/* Steps */}
            <section className="py-12 px-6">
                <div className="max-w-3xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex gap-6 mb-12 last:mb-0">
                            <div className={`shrink-0 size-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg
                                ${step.color === 'blue' ? 'bg-blue-500 shadow-blue-500/30' : ''}
                                ${step.color === 'purple' ? 'bg-purple-500 shadow-purple-500/30' : ''}
                                ${step.color === 'green' ? 'bg-green-500 shadow-green-500/30' : ''}
                            `}>
                                {step.number}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Example */}
            <section className="py-16 px-6 bg-white dark:bg-gray-900/50 border-y border-gray-100 dark:border-white/5">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-8">Real Simple Math</h2>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <div className="text-3xl font-black text-primary">10</div>
                                <div className="text-xs uppercase text-gray-500 font-bold">People</div>
                            </div>
                            <div className="border-x border-gray-200 dark:border-gray-700">
                                <div className="text-3xl font-black text-primary">$100</div>
                                <div className="text-xs uppercase text-gray-500 font-bold">Monthly</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-primary">10</div>
                                <div className="text-xs uppercase text-gray-500 font-bold">Months</div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Each month, one person receives <span className="font-black text-primary text-2xl">$1,000</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            By the end, everyone has received exactly what they put in. Simple.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-10">Why Use Orbit?</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex gap-4">
                                <span className="material-symbols-outlined text-primary text-2xl shrink-0">{benefit.icon}</span>
                                <div>
                                    <h3 className="font-bold mb-1">{benefit.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to start saving?</h2>
                <Link
                    href="/signup"
                    className="inline-flex px-8 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/30"
                >
                    Get Started
                </Link>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-white/5">
                <p>© {new Date().getFullYear()} Orbit. Built for communities, not profit.</p>
            </footer>
        </div>
    );
}
