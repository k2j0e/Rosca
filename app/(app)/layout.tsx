import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("session_user_id")?.value;

    if (!sessionUserId) {
        redirect("/signin");
    }

    // Check onboarding status
    const { prisma } = await import("@/lib/db");
    const user = await prisma.user.findUnique({
        where: { id: sessionUserId },
        select: { hasCompletedOnboarding: true }
    });

    if (!user) {
        // Session invalid, clear and redirect
        redirect("/signin");
    }

    if (!user.hasCompletedOnboarding) {
        redirect("/onboarding");
    }

    return (
        <>
            {children}
            <BottomNav />
        </>
    );
}
