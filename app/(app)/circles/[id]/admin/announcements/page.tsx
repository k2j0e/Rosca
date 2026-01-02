"use strict";

import { getCurrentUser } from "@/lib/data";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AnnouncementsClient from "./AnnouncementsClient";

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    const circle = await prisma.circle.findUnique({
        where: { id: params.id },
        include: {
            announcements: {
                orderBy: [
                    { isPinned: 'desc' },
                    { createdAt: 'desc' }
                ]
            }
        }
    });

    if (!circle) {
        notFound();
    }

    // Check admin permission
    if (circle.adminId !== user.id) {
        redirect(`/circles/${params.id}/dashboard`);
    }

    return (
        <AnnouncementsClient
            circleId={params.id}
            announcements={circle.announcements}
        />
    );
}
