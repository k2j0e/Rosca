import Link from "next/link";
import { signOutAction } from "../actions";

export default function SuspendedPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-[40px]">
                    block
                </span>
            </div>

            <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                Account Suspended
            </h1>

            <p className="text-text-sub dark:text-text-sub-dark max-w-sm mb-8 leading-relaxed">
                Your account has been suspended due to a violation of our community terms.
                If you believe this is a mistake, please contact support.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Link
                    href="mailto:support@rosca.app"
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl transition hover:opacity-90"
                >
                    Contact Support
                </Link>

                <form action={signOutAction}>
                    <button
                        type="submit"
                        className="w-full bg-transparent text-text-sub dark:text-text-sub-dark font-bold py-3.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition"
                    >
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
