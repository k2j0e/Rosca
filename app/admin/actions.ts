'use server';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function adminLoginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: "Email and password are required." };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { message: "Invalid credentials." };
        }

        if (!user.password) {
            return { message: "This account is not set up for password login." };
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return { message: "Invalid credentials." };
        }

        // Check Role
        const allowedRoles = ['platform_admin', 'support_agent', 'read_only_analyst'];
        if (!allowedRoles.includes(user.role)) {
            return { message: "Access denied. Insufficient permissions." };
        }

        // Set Admin Session Cookie
        // In a real app, this should be a signed JWT.
        // For this MVP, we are setting a simple flag cookie that our middleware will check.
        // Security NOTE: This is weak. Anyone can forge this cookie if they know the name.
        // TODO: Switch to JWT or signed cookie in Phase 18.
        const cookieStore = await cookies();
        cookieStore.set('admin_session_token', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

    } catch (error) {
        console.error("Admin Login Error:", error);
        return { message: "An unexpected error occurred." };
    }

    redirect('/admin');
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session_token');
    redirect('/admin/login');
}
