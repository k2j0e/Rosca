import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "@/app/components/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("session_user_id")?.value;

    if (!sessionUserId) {
        redirect("/signin");
    }

    // Check onboarding status and get user data for nav
    const { prisma } = await import("@/lib/db");
    const user = await prisma.user.findUnique({
        where: { id: sessionUserId },
        select: { hasCompletedOnboarding: true, name: true, avatar: true }
    });

    if (!user) {
        redirect("/signin");
    }

    if (!user.hasCompletedOnboarding) {
        redirect("/onboarding");
    }

    return (
        <AppShell user={{ name: user.name, avatar: user.avatar }}>
            {children}
        </AppShell>
    );
}

