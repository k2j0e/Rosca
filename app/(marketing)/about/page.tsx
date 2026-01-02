import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Mission Hero */}
            <section className="py-20 md:py-32 px-6 bg-[#D4E8D6] dark:bg-green-900/20 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-2 bg-[#F6C6B6]/50 dark:bg-orange-900/40 text-sm font-bold tracking-widest uppercase mb-8 rounded-full">Start Saving Together</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-8 text-text-main dark:text-white">Ready to Save Together?</h1>
                    <p className="text-xl md:text-2xl text-text-main/80 dark:text-white/80 leading-relaxed max-w-3xl mx-auto mb-12">
                        Join a savings circle with people you trust, or create one for your community. No banks, no interest, no debt — just coordination, transparency, and mutual support. Whether you need funds sooner or want to build disciplined savings habits, there's a place for you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup">
                            <button className="px-10 py-4 bg-[#A3320B] text-white font-bold text-lg rounded-full hover:bg-[#8a2a09] transition-all shadow-xl">
                                Get Started
                            </button>
                        </Link>
                        <Link href="/explore">
                            <button className="px-10 py-4 bg-transparent border-2 border-[#A3320B] text-[#A3320B] dark:text-white dark:border-white font-bold text-lg rounded-full hover:bg-[#A3320B]/10 transition-all">
                                Explore Circles
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-black/10 dark:border-white/10 text-sm text-text-main/60 dark:text-white/60">
                    Designed for families, friends, and communities. Inspired by savings traditions used worldwide for generations. Now with digital convenience, transparent tracking, and modern coordination tools.
                </div>
            </section>

            {/* Traditions Wheel */}
            <section className="py-24 px-6 bg-[#E3F0E5] dark:bg-green-950/20">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Inspired by Centuries of Tradition</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-20">
                        Savings circles aren't new — they're ancient. Communities worldwide have used rotating savings groups for generations, under many different names. We're simply bringing this proven model into the digital age.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 relative">
                        {/* Center Circle (Visual Only - could be an icon or logo) */}
                        <div className="hidden md:flex absolute inset-0 items-center justify-center z-0 opacity-10">
                            <div className="w-64 h-64 rounded-full border-4 border-current"></div>
                        </div>

                        {[
                            { name: 'Tandas', region: 'Mexico and Latin America' },
                            { name: 'Chit Funds', region: 'India and South Asia' },
                            { name: 'Ayuuto', region: 'Somalia and Horn of Africa' },
                            { name: 'Susus', region: 'West Africa and Caribbean' },
                            { name: 'Stokvels', region: 'South Africa' },
                            { name: 'Hui', region: 'China and East Asia' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-white/5 rounded-3xl backdrop-blur-sm hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-4xl mb-4 text-gray-400">public</span>
                                <h3 className="text-2xl font-bold mb-2 text-text-main dark:text-white">{item.name}</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">{item.region}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 flex gap-4 max-w-3xl mx-auto text-left border-l-4 border-[#F25F15] pl-6">
                        <p className="text-xl md:text-2xl font-medium text-text-main dark:text-white italic">
                            "For generations, my family has participated in tandas. Now I can organize them digitally with cousins across three states. Same trust, better tracking." — Maria, Circle Organizer
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
