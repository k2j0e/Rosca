'use server';

import { requireAdmin, logAdminAction } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function sendBroadcastAction(prevState: any, formData: FormData) {
    const admin = await requireAdmin('support_agent');

    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const audienceType = formData.get('audienceType') as string; // 'all', 'admins', 'user'
    const targetId = formData.get('targetId') as string;

    if (!title || !body || !audienceType) {
        return { message: "Title, Body, and Audience are required." };
    }

    try {
        let audience: any = {};

        switch (audienceType) {
            case 'all':
                audience = { type: 'global' };
                break;
            case 'admins':
                audience = { role: 'admin' };
                break;
            case 'user':
                if (!targetId) return { message: "Target User ID is required for direct messages." };
                audience = { userId: targetId };
                break;
            default:
                return { message: "Invalid audience type." };
        }

        // Create Log
        await prisma.notificationLog.create({
            data: {
                type: 'broadcast', // or 'direct' depending on audience
                title,
                body,
                audience,
                sentByUserId: admin.id
            }
        });

        // Audit Log
        await logAdminAction(admin.id, 'SEND_BROADCAST', 'SYSTEM', 'BROADCAST', `Sent notification: "${title}" to ${audienceType}`);

        revalidatePath('/admin/notifications');
    } catch (error) {
        console.error("Send broadcast failed:", error);
        return { message: "Failed to send broadcast." };
    }

    redirect('/admin/notifications');
}
