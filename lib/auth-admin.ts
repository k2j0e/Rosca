import { getCurrentUser, User } from './data';
import { prisma } from './db';
import { redirect } from 'next/navigation';

export type AdminRole = 'platform_admin' | 'support_agent' | 'read_only_analyst';

// Permission hierarchy: admin > support > analyst
const ROLE_HIERARCHY: Record<AdminRole, number> = {
    'platform_admin': 3,
    'support_agent': 2,
    'read_only_analyst': 1
};

function hasPermission(userRole: string, requiredRole: AdminRole): boolean {
    if (!userRole || userRole === 'user') return false;
    const userLevel = ROLE_HIERARCHY[userRole as AdminRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole];
    return userLevel >= requiredLevel;
}

export async function requireAdmin(requiredRole: AdminRole = 'read_only_analyst'): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin?redirect=/admin');
    }

    if (!hasPermission(user.role, requiredRole)) {
        redirect('/'); // Or a specialized 403 page
    }

    return user;
}

export async function logAdminAction(
    adminId: string,
    action: string,
    targetType: 'CIRCLE' | 'USER' | 'MEMBER' | 'SYSTEM',
    targetId: string,
    changes?: any,
    reason?: string
) {
    try {
        await prisma.auditLog.create({
            data: {
                adminId,
                action,
                targetType,
                targetId,
                changes: changes || {},
                reason: reason || ''
            }
        });
    } catch (e) {
        console.error("Failed to log admin action:", e);
        // Don't crash the request if audit logging fails, but alert in logs
    }
}
