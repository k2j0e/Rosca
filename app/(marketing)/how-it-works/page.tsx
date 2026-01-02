export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <section className="py-20 px-6 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-black mb-8">Two Ways to Participate</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-16">
                    Every circle needs both roles to work. Some members need funds sooner, others are building savings discipline. Both benefit, just in different ways and at different times in the cycle.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Access Sooner */}
                    <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 shadow-sm">
                        <div className="h-32 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border-b border-orange-100 dark:border-transparent">
                            <span className="material-symbols-outlined text-5xl text-[#F25F15]">rocket_launch</span>
                        </div>
                        <div className="p-8 md:p-12">
                            <h2 className="text-3xl font-bold mb-6">Access Funds Sooner</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Perfect if you have:</h3>
                                    <p className="text-gray-700 dark:text-gray-300">An upcoming expense, emergency need, business opportunity, or time-sensitive goal.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">How it works:</h3>
                                    <p className="text-gray-700 dark:text-gray-300">You receive your payout early in the circle (months 1-3), then contribute the rest of the cycle knowing you've already gotten what you needed.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">The benefit:</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Access a lump sum without interest, credit checks, or debt. Your community supports you when timing matters most.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Steadily */}
                    <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 shadow-sm">
                        <div className="h-32 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border-b border-orange-100 dark:border-transparent">
                            <span className="material-symbols-outlined text-5xl text-[#F25F15]">account_balance</span>
                        </div>
                        <div className="p-8 md:p-12">
                            <h2 className="text-3xl font-bold mb-6">Save Steadily</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Perfect if you want:</h3>
                                    <p className="text-gray-700 dark:text-gray-300">Disciplined saving, helping others, or building an emergency fund without temptation to spend early.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">How it works:</h3>
                                    <p className="text-gray-700 dark:text-gray-300">You contribute each month while others receive first, then get your full amount later in the circle (months 7-10).</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">The benefit:</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Forced savings with social accountability. By the time it's your turn, you've built a substantial fund while supporting your community.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
