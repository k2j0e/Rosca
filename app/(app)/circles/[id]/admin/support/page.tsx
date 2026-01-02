"use strict";

import { getCurrentUser } from "@/lib/data";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import SupportClient from "./SupportClient";

export const dynamic = 'force-dynamic';

export default async function SupportPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    const circle = await prisma.circle.findUnique({
        where: { id: params.id },
        select: { id: true, name: true, adminId: true }
    });

    if (!circle) {
        notFound();
    }

    // Check admin permission
    if (circle.adminId !== user.id) {
        redirect(`/circles/${params.id}/dashboard`);
    }

    return (
        <SupportClient
            circleId={params.id}
            circleName={circle.name}
        />
    );
}
