import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center text-center p-6 font-display">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
                <span className="material-symbols-outlined text-4xl text-gray-400">explore_off</span>
            </div>
            <h2 className="text-3xl font-black text-text-main dark:text-white mb-2">Page Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                We couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
            <Link href="/home">
                <button className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all">
                    Return Home
                </button>
            </Link>
        </div>
    );
}
