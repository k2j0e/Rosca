import Link from "next/link";
import { notFound } from "next/navigation";
import { getCircle } from "@/lib/data";
import { joinCircleAction } from "@/app/actions";

export default async function JoinCircleIntent(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);

    if (!circle) {
        notFound();
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white">
            {/* Progress Header */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm border-b border-gray-100 dark:border-white/5">
                <Link href={`/circles/${circle.id}/join`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <div className="flex gap-1">
                    <div className="w-16 h-1 rounded-full bg-primary overflow-hidden"></div>
                    <div className="w-16 h-1 rounded-full bg-primary overflow-hidden">
                        <div className="w-full h-full bg-primary animate-pulse"></div>
                    </div>
                </div>
                <div className="w-12"></div>
            </div>

            <div className="px-6 py-6 flex flex-col flex-1">
                <h1 className="text-3xl font-extrabold tracking-tight mb-3">Set your intent</h1>
                <p className="text-text-sub dark:text-text-sub-dark text-lg mb-8 leading-relaxed">
                    What is your main goal for joining <span className="font-bold text-text-main dark:text-white">{circle.name}</span>?
                </p>

                <form action={joinCircleAction} className="flex flex-col flex-1">
                    <input type="hidden" name="circleId" value={circle.id} />

                    {/* Intent TextArea */}
                    <div className="relative mb-8">
                        <textarea
                            name="intent"
                            className="w-full h-32 bg-white dark:bg-surface-dark border-2 border-gray-200 dark:border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-300 dark:placeholder:text-white/20 shadow-sm"
                            placeholder="e.g. I want to save for my daughter's tuition..."
                        ></textarea>
                    </div>

                    {/* Payout Preference */}
                    <div className="mb-6">
                        <label className="block text-text-main dark:text-white font-bold mb-3 text-lg">
                            Payout Timing Preference
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all cursor-pointer">
                                <input type="radio" name="preference" value="early" className="w-5 h-5 accent-primary" />
                                <div className="ml-3">
                                    <span className="block font-bold text-text-main dark:text-white">Early</span>
                                    <span className="text-sm text-text-sub dark:text-text-sub-dark">I need funds sooner (e.g. for an upcoming event).</span>
                                </div>
                            </label>
                            <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all cursor-pointer">
                                <input type="radio" name="preference" value="late" className="w-5 h-5 accent-primary" />
                                <div className="ml-3">
                                    <span className="block font-bold text-text-main dark:text-white">Late</span>
                                    <span className="text-sm text-text-sub dark:text-text-sub-dark">I want to use this as savings/investment.</span>
                                </div>
                            </label>
                            <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-white/10 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all cursor-pointer">
                                <input type="radio" name="preference" value="any" defaultChecked className="w-5 h-5 accent-primary" />
                                <div className="ml-3">
                                    <span className="block font-bold text-text-main dark:text-white">Any / Flexible</span>
                                    <span className="text-sm text-text-sub dark:text-text-sub-dark">No specific preference.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/10 mb-auto">
                        <span className="material-symbols-outlined text-orange-500 mt-0.5">visibility</span>
                        <p className="text-sm text-text-sub dark:text-text-sub-dark leading-snug">
                            This will be shared with the circle admin and members to build trust.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-6 flex flex-col gap-3 pb-6">
                        <button
                            type="submit"
                            className="w-full h-14 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30"
                        >
                            Finish & Go to Dashboard
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>

                        <button
                            type="submit"
                            className="w-full py-3 text-text-sub dark:text-text-sub-dark font-bold hover:text-text-main dark:hover:text-white transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                </form>
            </div >

        </div >
    );
}
