'use server';

import { requireAdmin, logAdminAction } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function banUserAction(userId: string, reason: string) {
    const admin = await requireAdmin('support_agent');

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isBanned: true }
        });

        await logAdminAction(admin.id, 'BAN_USER', 'USER', userId, reason);
        revalidatePath(`/admin/users/${userId}`);
        return { success: true, message: 'User has been banned.' };
    } catch (error) {
        console.error("Ban user failed:", error);
        return { success: false, message: 'Failed to ban user.' };
    }
}

export async function unbanUserAction(userId: string) {
    const admin = await requireAdmin('support_agent');

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isBanned: false }
        });

        await logAdminAction(admin.id, 'UNBAN_USER', 'USER', userId, "Manual unban");
        revalidatePath(`/admin/users/${userId}`);
        return { success: true, message: 'User has been unbanned.' };
    } catch (error) {
        console.error("Unban user failed:", error);
        return { success: false, message: 'Failed to unban user.' };
    }
}

export async function freezeCircleAction(circleId: string, reason: string) {
    const admin = await requireAdmin('support_agent');

    try {
        await prisma.circle.update({
            where: { id: circleId },
            data: {
                isFrozen: true,
                // Optionally status: 'paused' ? Or just keep isFrozen flag. Setting flag is safer.
            }
        });

        await logAdminAction(admin.id, 'FREEZE_CIRCLE', 'CIRCLE', circleId, reason);
        revalidatePath(`/admin/circles/${circleId}`);
        return { success: true, message: 'Circle has been frozen. Payouts stopped.' };
    } catch (error) {
        console.error("Freeze circle failed:", error);
        return { success: false, message: 'Failed to freeze circle.' };
    }
}

export async function unfreezeCircleAction(circleId: string) {
    const admin = await requireAdmin('support_agent');

    try {
        await prisma.circle.update({
            where: { id: circleId },
            data: { isFrozen: false }
        });

        await logAdminAction(admin.id, 'UNFREEZE_CIRCLE', 'CIRCLE', circleId, "Manual unfreeze");
        revalidatePath(`/admin/circles/${circleId}`);
        return { success: true, message: 'Circle has been unfrozen.' };
    } catch (error) {
        console.error("Unfreeze circle failed:", error);
        return { success: false, message: 'Failed to unfreeze circle.' };
    }
}
