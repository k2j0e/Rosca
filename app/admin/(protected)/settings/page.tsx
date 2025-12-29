
export default function AdminSettingsPage() {
    return (
        <div className="p-8 max-w-4xl cursor-default select-none">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
                <p className="text-slate-500">Global configurations and system preferences.</p>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center py-16">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-slate-400">tune</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Settings Coming Soon</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                    This module is currently under development. Phase 27 will introduce global configurations.
                </p>
                <div className="flex gap-2 justify-center">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                        General
                    </button>
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                        Payment Gateways
                    </button>
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                        API Keys
                    </button>
                </div>
            </div>
        </div>
    );
}
