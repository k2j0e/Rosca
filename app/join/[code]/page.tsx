import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function JoinShortCodePage(props: { params: Promise<{ code: string }> }) {
    const params = await props.params;
    const { code } = params;

    if (!code || code.length < 3) return notFound();

    // Find circle by invite code
    const circle = await prisma.circle.findUnique({
        where: { inviteCode: code.toUpperCase() },
        select: { id: true }
    });

    if (!circle) {
        return notFound();
    }

    // Redirect to the regular join page or circle profile
    // Logic: If user is logged in, they see "Request to Join" on profile
    // If not logged in, they see "Request to Join" which redirects to Login
    redirect(`/circles/${circle.id}?joined=intent`);
}
