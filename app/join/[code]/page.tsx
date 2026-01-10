import { notFound, redirect } from "next/navigation";
import { getCircleByInviteCode, getCurrentUser } from "@/lib/data";
import AppWalkthrough from "@/app/components/AppWalkthrough";

export default async function JoinShortCodePage(props: { params: Promise<{ code: string }> }) {
    const params = await props.params;
    const { code } = params;

    if (!code) notFound();

    const circle = await getCircleByInviteCode(code);
    const user = await getCurrentUser();

    if (!circle) {
        notFound();
    }

    // Smart Routing: If logged in, skip the sales pitch and go to completion
    if (user) {
        // Check if already a member
        const isMember = circle.members.some(m => m.userId === user.id);
        if (isMember) {
            redirect(`/circles/${circle.id}/dashboard`);
        } else {
            redirect(`/circles/${circle.id}/join`);
        }
    }

    // Public Landing Page
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">
            {/* Header / Nav */}
            <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                        8
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-text-main dark:text-white">Circle8</span>
                </div>
                <a href={`/signin?redirect=${encodeURIComponent(`/circles/${circle.id}/join`)}`} className="text-sm font-bold text-text-sub hover:text-primary transition-colors">
                    Log in
                </a>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 pb-12 max-w-md mx-auto w-full">
                {/* Host Info */}
                <div className="text-center mb-8 animate-in fade-in zoom-in duration-700">
                    <div className="inline-block p-1 rounded-full border-2 border-primary/20 bg-white dark:bg-surface-dark mb-4">
                        {circle.admin?.avatar ? (
                            <img src={circle.admin.avatar} alt={circle.admin.name} className="w-20 h-20 rounded-full" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                {circle.admin?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-extrabold text-text-main dark:text-white mb-2 leading-tight">
                        {circle.admin?.name || 'Admin'} invited you to join <span className="text-primary">{circle.name}</span>
                    </h1>
                    <p className="text-text-sub dark:text-text-sub-dark text-lg">
                        A ${circle.amount} {circle.frequency} savings circle
                    </p>
                </div>

                {/* Walkthrough Card */}
                <div className="w-full animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150">
                    <AppWalkthrough circle={circle} />
                </div>
            </div>
        </div>
    );
}
