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

    console.log("Attempting Admin Login:", email);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log("User not found via email");
            return { message: "Invalid credentials (User not found)." };
        }

        if (!user.password) {
            console.log("User has no password set");
            return { message: "This account is not set up for password login." };
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            console.log("Invalid password");
            return { message: "Invalid credentials (Password mismatch)." };
        }

        // Check Role
        const allowedRoles = ['platform_admin', 'support_agent', 'read_only_analyst'];
        if (!allowedRoles.includes(user.role)) {
            console.log("Insufficient permissions", user.role);
            return { message: "Access denied. Insufficient permissions." };
        }

        if (user.isBanned) {
            return { message: "Account suspended. Contact support." };
        }

        // Set Admin Session Cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session_token', user.id, {
            httpOnly: true,
            secure: false, // process.env.NODE_ENV === 'production' (Relaxed for localhost testing)
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        console.log("Admin Login Successful for:", user.email);

    } catch (error) {
        console.error("Admin Login Error:", error);
        return { message: `Error: ${(error as any).message || String(error)}` }; // DEBUG MODE
    }

    redirect('/admin');
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session_token');
    redirect('/admin/login');
}
