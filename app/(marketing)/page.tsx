import Link from "next/link";
import { cookies } from "next/headers";
import { MarketingAnimation } from "../components/MarketingAnimation";

export default async function LandingPage() {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("session_user_id")?.value;
    const isLoggedIn = !!sessionUserId;

    return (
        <>
            {/* Hero Section */}
            <section className="py-16 md:py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-start text-left">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-text-main dark:text-white">
                            Freedom Starts<br />
                            <span className="text-[#F25F15]">with Saving.</span><br />
                            Together.
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
                            A trusted community helps each other reach goals — without banks, debt, or interest. Join a savings circle where members commit together and take turns accessing their shared savings.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link href={isLoggedIn ? "/home" : "/signup"} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-[#F25F15] text-white font-bold text-lg rounded-full hover:bg-[#d8500c] transition-all shadow-xl shadow-[#F25F15]/20">
                                    Begin Your Saving Journey
                                </button>
                            </Link>
                            <Link href="/how-it-works" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-transparent border-2 border-[#F25F15] text-[#F25F15] font-bold text-lg rounded-full hover:bg-[#F25F15]/5 transition-all">
                                    See How It Works
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                            alt="Friends supporting each other"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Why People Choose Savings Circles */}
            <section className="pb-24 pt-0 px-6 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-text-main dark:text-white">Why People Choose Savings Circles</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-4xl">
                        From building financial discipline to supporting your community, savings circles offer something traditional finance can't: human connection paired with shared commitment.
                    </p>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                        {[
                            {
                                icon: 'percent',
                                title: 'Save Without Debt',
                                desc: 'No credit checks, no loan applications, no interest charges. Reach your goals without getting trapped in debt cycles.'
                            },
                            {
                                icon: 'calendar_month',
                                title: 'Choose When You Receive',
                                desc: 'Need your savings sooner for an opportunity? Or prefer to save steadily? The turn-based system gives everyone fair options.'
                            },
                            {
                                icon: 'handshake',
                                title: 'Build Discipline Together',
                                desc: 'When your community is counting on you, you\'re more likely to stick to your savings commitment. Mutual accountability creates lasting habits.'
                            },
                            {
                                icon: 'diversity_3',
                                title: 'Support Your Community',
                                desc: 'Help each other reach goals. When someone in your circle receives their turn, you\'re part of making that happen.'
                            },
                            {
                                icon: 'public',
                                title: 'Culturally Inclusive',
                                desc: 'This practice exists in cultures worldwide — from tandas to chit funds to susus. Now it\'s accessible to everyone, digitally.'
                            },
                            {
                                icon: 'description',
                                title: 'Transparent & Fair',
                                desc: 'Everyone sees the same information. No hidden fees, no fine print, no surprises. Just clear terms everyone agrees to.'
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-start">
                                <div className="mb-4">
                                    <span className="material-symbols-outlined text-4xl text-[#F25F15]">{item.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main dark:text-white">{item.title}</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Built on Trust, Not Banks */}
            <section className="py-24 px-6 bg-gray-50 dark:bg-white/5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-8">Built on Trust, Not Banks</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-4xl">
                        We're not a bank, investment platform, or loan company. We're a coordination tool that helps communities organize what they've been doing for centuries — but with transparency, tracking, and digital convenience.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        {/* What This Is */}
                        <div>
                            <h3 className="flex items-center gap-3 text-2xl font-bold mb-8 text-text-main dark:text-white">
                                <span className="text-green-600 material-symbols-outlined font-bold">check</span>
                                What This Is
                            </h3>
                            <ul className="space-y-4">
                                {['A coordination and tracking tool', 'For trusted communities only', 'Transparent to all members', 'Zero-interest commitment', 'Community-governed membership', 'Savings through mutual support'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* What This Is Not */}
                        <div>
                            <h3 className="flex items-center gap-3 text-2xl font-bold mb-8 text-text-main dark:text-white">
                                <span className="text-gray-500 material-symbols-outlined font-bold">close</span>
                                What This Is Not
                            </h3>
                            <ul className="space-y-4">
                                {['A bank or financial institution', 'An investment or yield platform', 'A loan or credit product', 'A cryptocurrency scheme', 'Open to strangers', 'A get-rich-quick opportunity'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Important Banner */}
                    <div className="bg-[#FFDAC6] dark:bg-orange-900/30 rounded-2xl p-8 flex gap-6 items-start">
                        <span className="material-symbols-outlined text-3xl text-text-main dark:text-white shrink-0 mt-1">info</span>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-text-main dark:text-white">We Don't Hold Your Money</h3>
                            <p className="text-text-main/80 dark:text-white/80 leading-relaxed">
                                Members contribute directly to each other. The app simply tracks commitments, schedules, and whose turn it is. Your circle coordinator verifies contributions. We provide the software, you provide the trust.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real Example */}
            <section className="py-24 px-6 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-16">A Real Example: See the Numbers</h2>

                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        {/* Left: Circle Details */}
                        <div className="space-y-8">
                            <div className="bg-[#FFDAC6] dark:bg-orange-900/30 rounded-3xl p-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="material-symbols-outlined text-3xl">pie_chart</span>
                                    <h3 className="text-2xl font-bold">Circle Details</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-lg font-medium">
                                        <span className="text-2xl leading-none">•</span>
                                        <span><span className="font-bold">10 members</span> in the circle</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-lg font-medium">
                                        <span className="text-2xl leading-none">•</span>
                                        <span><span className="font-bold">$100 per month</span> contribution from each</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-lg font-medium">
                                        <span className="text-2xl leading-none">•</span>
                                        <span><span className="font-bold">10 months</span> total duration</span>
                                    </li>
                                </ul>
                            </div>

                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                Each month, one member receives <span className="font-bold text-text-main dark:text-white">$1,000</span>. By the end, everyone has received exactly <span className="font-bold text-text-main dark:text-white">$1,000</span>.
                            </p>

                            <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-medium px-4 py-2 rounded-lg">
                                No interest. No debt. Just community.
                            </div>
                        </div>

                        {/* Right: Interactive Animation */}
                        <div className="relative pl-0 lg:pl-8 pt-4">
                            <MarketingAnimation />
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 px-6 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-8">How Community Savings Circles Work</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-20 max-w-4xl">
                        Forget complicated financial products. This is simple, transparent, and built on trust. Every member commits the same amount on a regular schedule, and each round, one member receives the full circle savings. Everyone takes a turn until the circle completes.
                    </p>

                    <div className="grid md:grid-cols-3 gap-12 border-t-2 border-[#F25F15] pt-12">
                        {[
                            {
                                icon: 'groups',
                                title: 'Commit Together',
                                desc: 'Everyone commits the same amount on a regular schedule — weekly, monthly, or whatever works for your community.'
                            },
                            {
                                icon: 'volunteer_activism',
                                title: 'One Member Receives',
                                desc: 'Each round, a different member receives the full sum. The turn order is agreed upon by the community from the start.'
                            },
                            {
                                icon: 'sync_alt',
                                title: 'Everyone Takes a Turn',
                                desc: 'Some receive their savings sooner, others save steadily. It\'s fair, transparent, and works for everyone.'
                            }
                        ].map((step, i) => (
                            <div key={i}>
                                <div className="mb-6">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 font-light">{step.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-[#F25F15]">{step.title}</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 px-6 text-center bg-gray-50 dark:bg-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl font-black mb-8">Ready to Start Saving?</h2>
                    <Link href="/signup">
                        <button className="px-12 py-5 bg-[#F25F15] text-white font-bold text-xl rounded-full hover:bg-[#d8500c] hover:scale-105 transition-all shadow-xl shadow-[#F25F15]/30">
                            Begin Your Saving Journey
                        </button>
                    </Link>
                    <p className="mt-8 text-gray-500">
                        No credit card required
                    </p>
                </div>
            </section>
        </>
    );
}
