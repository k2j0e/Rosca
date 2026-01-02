export default function SupportPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h1 className="text-5xl font-black mb-16">Your Questions Answered</h1>

                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">What if someone doesn't pay?</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                This is why you only join circles with people you trust. If someone misses a payment, the group decides how to handle it — whether to pause, restructure, or remove that member. The app tracks everything, but the community enforces accountability.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Can I join multiple circles?</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Absolutely. Many users participate in different circles for different goals — one with family for emergency savings, another with friends for vacation funds. Just ensure you can manage all your commitments.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">How do payments work?</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Members pay each other directly using whatever method your group prefers — bank transfer, payment app, even cash. The app doesn't process payments; it just tracks who's paid and confirms contributions.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Is this legal?</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Yes. Informal savings circles have operated legally for centuries worldwide. We're not providing financial services — we're providing organizational software for groups managing their own arrangements.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">What if I need to leave early?</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                It's complicated, which is why commitment is crucial. If you must leave, you'll need to find a replacement or make arrangements with your circle admin. This disrupts the group, so choose carefully before joining.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">How much should I contribute?</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Start small — maybe $50 or $100 monthly. Choose an amount you can comfortably afford for the full circle duration. Remember, you're committing to every payment, even after you receive your payout.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
