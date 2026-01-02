export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h1 className="text-5xl font-black mb-8">Safety Through Community, Not Institutions</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mb-16 bg">
                    Traditional finance relies on credit scores, legal contracts, and institutional enforcement. Savings circles rely on something more powerful: reputation, relationships, and shared accountability. Here's how the system protects everyone involved.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {[
                        { icon: 'security', title: 'Admin Controls Access', desc: 'Circle creators decide who joins. Only invite people you know and trust. No strangers, no algorithms deciding membership.' },
                        { icon: 'visibility', title: 'Full Transparency', desc: 'Everyone sees who\'s paid, who\'s received, and what\'s coming next. No information asymmetry, no surprises.' },
                        { icon: 'assignment', title: 'Clear Agreements', desc: 'Payment schedule, amounts, and payout order are set before the circle starts. Everyone agrees to the same terms.' },
                        { icon: 'groups', title: 'Social Accountability', desc: 'Your reputation in the community is on the line. Most people honor commitments when others are counting on them.' }
                    ].map((item, i) => (
                        <div key={i} className="border border-green-600/30 rounded-2xl p-8 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white mb-6">
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Recommended Best Practices</h2>
                        <ul className="space-y-4">
                            {[
                                'Start with small amounts in your first circle together',
                                'Only join circles with people you know personally',
                                'Have a backup plan if someone can\'t pay one month',
                                'Consider requiring first-payout recipients to contribute upfront',
                                'Communicate openly throughout the circle\'s duration',
                                'Celebrate when everyone completes the cycle successfully'
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2.5"></div>
                                    <span className="text-lg text-gray-700 dark:text-gray-300">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                            alt="Trust handshake"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
