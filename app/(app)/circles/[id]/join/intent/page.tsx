import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCircle, getCurrentUser } from "@/lib/data";
import { JoinIntentForm } from "./JoinIntentForm";

export default async function JoinCircleIntent(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect(`/signin?redirect=${encodeURIComponent(`/circles/${params.id}/join/intent`)}`);
    }

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

                <JoinIntentForm circleId={circle.id} circleName={circle.name} />
            </div >

        </div >
    );
}
