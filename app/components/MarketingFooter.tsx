import Link from "next/link";

export function MarketingFooter() {
    return (
        <footer className="py-12 px-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-text-main dark:text-white">Circle8</span>
                    </div>
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} Circle8 Financial Technologies.<br />All rights reserved.</p>
                </div>

                <div className="flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Link href="/about" className="hover:text-[#F25F15] transition-colors">About</Link>
                    <Link href="/how-it-works" className="hover:text-[#F25F15] transition-colors">How it Works</Link>
                    <Link href="/safety" className="hover:text-[#F25F15] transition-colors">Safety</Link>
                    <Link href="/support" className="hover:text-[#F25F15] transition-colors">Support</Link>
                    <Link href="#" className="hover:text-[#F25F15] transition-colors">Terms</Link>
                </div>

                <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-[#F25F15] transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">public</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-[#F25F15] transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">mail</span>
                    </button>
                </div>
            </div>
        </footer>
    );
}
