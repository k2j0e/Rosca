'use server';

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function updateCircleSettings(circleId: string, prevState: any, formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { message: "Unauthorized" };

    // Check admin permission
    const membership = await prisma.member.findFirst({
        where: {
            circleId,
            userId: user.id,
            role: 'admin'
        }
    });

    if (!membership) {
        return { message: "Only admins can update circle settings" };
    }

    const coverImage = formData.get('coverImage') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
        await prisma.circle.update({
            where: { id: circleId },
            data: {
                coverImage: coverImage || null,
                name: name || undefined,
                mission: description || undefined,
            }
        });

        revalidatePath(`/circles/${circleId}`);
        revalidatePath('/my-circles');
        return { message: "Settings updated successfully", success: true };
    } catch (error) {
        console.error("Circle settings update failed:", error);
        return { message: "Failed to update settings" };
    }
}
