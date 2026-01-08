"use client";

import { useState } from "react";

export function ExplainCircle8Trigger({ variant = "icon" }: { variant?: "icon" | "text" }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={variant === 'icon'
                    ? "size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    : "text-xs font-bold text-primary hover:underline flex items-center gap-1"
                }
            >
                {variant === 'icon' ? (
                    <span className="material-symbols-outlined text-lg">help</span>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-sm">info</span>
                        What is this?
                    </>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white dark:bg-black w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 relative border border-gray-100 dark:border-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
                                <span className="material-symbols-outlined text-3xl">diversity_3</span>
                            </div>

                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
                                What is this app?
                            </h2>

                            <div className="w-full space-y-4">
                                {/* The "NO" List */}
                                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 text-left">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                        It is NOT:
                                    </h3>
                                    <ul className="space-y-2 text-sm text-red-900 dark:text-red-200/80">
                                        <li className="flex gap-2">❌ A loan from a bank or strangers</li>
                                        <li className="flex gap-2">❌ An investment that yields profit</li>
                                        <li className="flex gap-2">❌ A digital wallet holding your cash</li>
                                    </ul>
                                </div>

                                {/* The "YES" List */}
                                <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 text-left">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        It IS:
                                    </h3>
                                    <ul className="space-y-2 text-sm text-green-900 dark:text-green-200/80">
                                        <li className="flex gap-2">✅ A tool to coordinate trusted groups</li>
                                        <li className="flex gap-2">✅ Interest-free financing</li>
                                        <li className="flex gap-2">✅ A way to save with friends</li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-8 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
