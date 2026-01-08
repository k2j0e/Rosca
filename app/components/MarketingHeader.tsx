import Link from "next/link";
import { cookies } from "next/headers";
import { Logo } from "./Logo";

export async function MarketingHeader() {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("session_user_id")?.value;
    const isLoggedIn = !!sessionUserId;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo size="md" variant="outline" className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-xl font-black tracking-tight text-text-main dark:text-white">Circle8</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#F25F15] transition-colors">
                        How it Works
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#F25F15] transition-colors">
                        About
                    </Link>
                    <Link href="/safety" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#F25F15] transition-colors">
                        Safety
                    </Link>
                    <Link href="/support" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#F25F15] transition-colors">
                        Support
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <Link href="/home">
                            <button className="px-6 py-2.5 bg-[#F25F15] text-white font-bold text-sm rounded-full hover:bg-[#d8500c] transition-all shadow-lg shadow-[#F25F15]/20">
                                Dashboard
                            </button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/signin" className="text-sm font-bold text-gray-600 hover:text-[#F25F15] transition-colors">
                                Sign In
                            </Link>
                            <Link href="/signup">
                                <button className="px-6 py-2.5 bg-[#F25F15] text-white font-bold text-sm rounded-full hover:bg-[#d8500c] transition-all shadow-lg shadow-[#F25F15]/20">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
