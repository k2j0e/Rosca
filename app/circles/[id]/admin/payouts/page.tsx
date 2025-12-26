import { getCircle } from "@/lib/data";
import Link from "next/link";
import { redirect } from "next/navigation";
import PayoutEditor from "./PayoutEditor";

export default async function AdminPayouts(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const circle = getCircle(params.id);

    if (!circle) {
        redirect("/profile");
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-[#f8f9fa] dark:bg-background-dark text-text-main dark:text-white font-display">
            {/* TopAppBar */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-[#f8f9fa]/90 dark:bg-background-dark/90 backdrop-blur-md">
                <Link href={`/circles/${params.id}/admin`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Manage Payout Order
                </h2>
                <div className="w-12"></div>
            </div>

            <div className="px-6 py-2 pb-2">
                <p className="text-text-sub dark:text-text-sub-dark text-sm leading-relaxed text-center">
                    Configure the payout sequence. Randomize for fairness or adjust manually.
                </p>
            </div>

            <PayoutEditor circle={circle} initialMembers={circle.members} />
        </div>
    );
}
