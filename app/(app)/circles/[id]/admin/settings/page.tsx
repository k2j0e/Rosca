import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { redirect, notFound } from "next/navigation";
import CircleSettingsClient from "./CircleSettingsClient";

export const dynamic = 'force-dynamic';

export default async function CircleSettingsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    const circle = await prisma.circle.findUnique({
        where: { id: params.id },
        include: {
            members: {
                where: { userId: user.id }
            }
        }
    });

    if (!circle) {
        notFound();
    }

    // Check admin permission
    const isAdmin = circle.members.some(m => m.role === 'admin');
    if (!isAdmin) {
        redirect(`/circles/${params.id}/dashboard`);
    }

    return (
        <CircleSettingsClient
            circleId={params.id}
            circle={{
                id: circle.id,
                name: circle.name,
                coverImage: circle.coverImage,
                mission: circle.description,
            }}
        />
    );
}
