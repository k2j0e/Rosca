import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export interface AdminUser {
    id: string;
    role: string;
    name: string;
}

export async function requireAdmin(minRole: 'platform_admin' | 'support_agent' | 'read_only_analyst' = 'read_only_analyst'): Promise<AdminUser> {
    const cookieStore = await cookies();

    // 1. Check for Admin Session Token (strict password login)
    const adminSessionId = cookieStore.get('admin_session_token')?.value;

    if (!adminSessionId) {
        redirect('/admin/login');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: adminSessionId },
            select: { id: true, role: true, name: true, isBanned: true }
        });

        if (!user || user.isBanned) {
            redirect('/admin/login'); // Redirect banned admins to login (or suspended)
        }

        // 2. Role Hierarchy Check
        const roleHierarchy = {
            'platform_admin': 3,
            'support_agent': 2,
            'read_only_analyst': 1,
            'user': 0
        };

        const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
        const requiredLevel = roleHierarchy[minRole];

        if (userRoleLevel < requiredLevel) {
            redirect('/'); // Or a "Forbidden" page
        }

        return user;
    } catch (error) {
        redirect('/admin/login');
    }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
    const cookieStore = await cookies();
    const adminSessionId = cookieStore.get('admin_session_token')?.value;

    if (!adminSessionId) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { id: adminSessionId },
            select: { id: true, role: true, name: true }
        });
        return user;
    } catch {
        return null;
    }
}

export async function logAdminAction(adminId: string, action: string, targetType: string, targetId: string, reason?: string) {
    try {
        await prisma.auditLog.create({
            data: {
                adminId,
                action,
                targetType,
                targetId,
                reason
            }
        });
    } catch (error) {
        console.error("Failed to log admin action:", error);
    }
}
