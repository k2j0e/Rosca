"use server";

import { createCircle, Circle, joinCircle, MOCK_USER, deleteUserSession, updateUser, getCurrentUser, User, findUserByPhone, registerUser, updateCircleMembers, Member, updateMemberStatus, updateCircleStatus } from "@/lib/data";
import { recordLedgerEntry, LedgerEntryType, LedgerEntryDirection } from "@/lib/ledger";
import { signInSchema, signUpSchema, createCircleSchema, joinCircleSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Define the type locally if not exported, or just use 'as any' if lazy, but let's try to match definition
// Based on lib/data.ts, Category is string literal union
type CircleCategory = "Travel" | "Business" | "Emergency" | "Other";

const DEFAULT_USER_MOCK: User = {
    id: 'u1',
    phoneNumber: '+15550109999',
    name: 'Amara Okafor',
    location: 'Lagos, Nigeria',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAasS-Tm_0L0SFa0loHUoMYYrgYAhVY6aD55T5IzbsW5tY6QKzBpccqQxkDa2UQvXpDcmXhKqnTvip2i8-944CMV65YQqlQegt_yuCR8bgCDTiCWVnCtCBu2rprE8gkgl5O663fgkcJbtR-oANpt1bbRGfiLudMWnzj1y_lPeM5_SGN2ovBXOBH3qUS3wZuVLFW8iAORYRPdCNKsOwut1-soe4EkwaDS8qa-RpFXfI6qjV_Au7mt_0he_V1B-vdlJkVxiO3K_2sDfZO',
    trustScore: 850,
    memberSince: "2023",
    role: 'user',
    isBanned: false,
    badges: [],
    stats: { circlesCompleted: 3, onTimePercentage: 98, supportCount: 8 },
    history: []
};

import { cookies } from "next/headers";

// ... (existing imports)

export async function signOutAction() {
    (await cookies()).delete('session_user_id');
    redirect('/welcome');
}

export async function sendOtpAction(formData: FormData) {
    const { signInSchema } = await import("@/lib/schemas");
    const { sendSms, generateOtp } = await import("@/lib/sms");
    const { prisma } = await import("@/lib/db");

    const rawPhone = formData.get('phone') as string;
    // Normalize: If no '+', assume US (+1) because UI shows +1 prefix hardcoded
    const phone = rawPhone.startsWith('+') ? rawPhone : `+1${rawPhone.replace(/\D/g, '')}`;

    const rawData = { phone };
    const validated = signInSchema.safeParse(rawData);

    if (!validated.success) {
        redirect('/signin?error=invalid_phone');
    }


    // const { phone } = validated.data; // Removed to avoid shadowing 'phone' variable defined above
    // valid 'phone' variable is already available and normalized
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Upsert user (create placeholder if new, update if exists)
    // Actually, for "Sign In", we usually expect them to exist? 
    // But for "Magic Link" style, we can just upsert.
    // Let's assume we find them first to decide if it's "Sign In" or "Sign Up" flow?
    // For now, simple auth: Update if exists. 

    const user = await prisma.user.findUnique({ where: { phoneNumber: phone } });

    if (!user) {
        redirect('/signup?error=user_not_found');
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            otpCode: otp,
            otpExpiresAt: expiresAt
        }
    });

    // Send SMS
    const smsResult = await sendSms(phone, `Your ROSCA verification code is: ${otp}`);

    if (!smsResult.success) {
        // Safe error for UI
        const errorMessage = (smsResult.error as any)?.message || 'Failed to send SMS.';
        // We need to redirect back with error because this action redirects on success
        // But invalidating the redirect is tricky if we want to show the error.
        // We can redirect to signin with error param.
        redirect(`/signin?error=${encodeURIComponent(errorMessage)}`);
    }

    // Redirect to verify page (we need to pass phone via query param or hidden state)
    // Ideally we shouldn't expose phone in URL but for MVP it's fine.
    redirect(`/signin/verify?phone=${encodeURIComponent(phone)}`);
}

export async function verifyOtpAction(formData: FormData) {
    const { verifyOtpSchema } = await import("@/lib/schemas");
    const { prisma } = await import("@/lib/db");

    const rawData = {
        phone: formData.get('phone') as string,
        code: formData.get('code') as string
    };

    const validated = verifyOtpSchema.safeParse(rawData);

    if (!validated.success) {
        redirect(`/signin/verify?phone=${rawData.phone}&error=invalid_code_format`);
    }

    const { phone, code } = validated.data;

    const user = await prisma.user.findUnique({ where: { phoneNumber: phone } });

    if (!user || user.otpCode !== code || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        redirect(`/signin/verify?phone=${phone}&error=invalid_code`);
    }

    // Success: Clear OTP and Set Session
    await prisma.user.update({
        where: { id: user.id },
        data: { otpCode: null, otpExpiresAt: null }
    });

    (await cookies()).set('session_user_id', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    redirect('/');
}

export async function checkUserExistsAction(rawPhone: string) {
    // Normalize: If no '+', assume US (+1)
    const phone = rawPhone.startsWith('+') ? rawPhone : `+1${rawPhone.replace(/\D/g, '')}`;
    console.log(`[Action] Checking if user exists for phone: ${phone}`);
    const user = await findUserByPhone(phone);
    console.log(`[Action] User found: ${!!user} (ID: ${user?.id})`);
    return !!user;
}

export async function createAccountAction(formData: FormData) {
    const rawPhone = formData.get('phone') as string;
    const phone = rawPhone.startsWith('+') ? rawPhone : `+1${rawPhone.replace(/\D/g, '')}`;

    const rawData = {
        name: formData.get('name') as string,
        phone,
        location: formData.get('location') as string
    };

    const validated = signUpSchema.safeParse(rawData);

    if (!validated.success) {
        console.error("Validation Error (SignUp):", validated.error.flatten());
        redirect('/signup?error=validation_failed');
    }

    const { name, location } = validated.data;
    // phone is already available from upper scope

    // Check if user already exists
    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
        // Prevent overwriting existing account
        redirect('/signin?error=account_exists');
    }

    // Create new user object
    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9), // New ID
        name,
        phoneNumber: phone,
        location: location || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`, // Dynamic avatar
        trustScore: 100, // Starting score
        memberSince: new Date().getFullYear().toString(),
        role: 'user',
        isBanned: false,
        badges: [],
        stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 },
        history: []
    };

    // 1. Save to Registry (Permanent storage)
    await registerUser(newUser);

    // 1. Save to Registry (Permanent storage)
    await registerUser(newUser);

    // --- UPDATED: Send OTP instead of auto-login ---
    const { sendSms, generateOtp } = await import("@/lib/sms");
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await import("@/lib/db").then(m => m.prisma.user.update({
        where: { id: newUser.id },
        data: {
            otpCode: otp,
            otpExpiresAt: expiresAt
        }
    }));

    await sendSms(phone, `Welcome to ROSCA! Your verification code is: ${otp}`);

    // Redirect to Verify Page
    redirect(`/signin/verify?phone=${encodeURIComponent(phone)}`);

    // Small delay to ensure DB consistency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Redirect to home as requested
    redirect('/');
}

export async function createCircleAction(formData: FormData) {
    const rawData = {
        name: formData.get("name") as string,
        category: formData.get("category"),
        amount: Number(formData.get("amount")),
        membersCount: Number(formData.get("membersCount")),
        frequency: (formData.get("frequency") as string || "monthly").toLowerCase(),
        privacy: formData.get("privacy"),
        description: formData.get("description") as string,
        rules: JSON.parse(formData.get("rules") as string || "[]"),
        coverImage: formData.get("coverImage") as string,
        payoutSchedule: JSON.parse(formData.get("payoutSchedule") as string || "[]")
    };

    const validated = createCircleSchema.safeParse(rawData);

    if (!validated.success) {
        console.error("Validation Error (CreateCircle):", validated.error.flatten());
        throw new Error("Invalid circle data: " + JSON.stringify(validated.error.flatten().fieldErrors));
    }

    const { name, category, amount, membersCount, frequency, description, rules, coverImage, payoutSchedule } = validated.data;

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Must be logged in to create a circle");

    const newCircle = await createCircle({
        name,
        category,
        amount, // This is technically contribution per person
        frequency,
        payoutTotal: amount * membersCount, // Simplification for MVP
        duration: membersCount, // 1 round per member
        maxMembers: membersCount, // Set capacity
        status: "recruiting",
        members: [], // Creator will be added by function
        description: description || `A ${frequency} circle for ${category}.`,
        rules,
        coverImage,
        payoutSchedule: JSON.parse(formData.get("payoutSchedule") as string || "[]"),
        settings: {}, // Future use
    }, currentUser);

    // Ledger: Log creator joining
    try {
        await recordLedgerEntry({
            type: LedgerEntryType.MEMBER_JOINED,
            direction: LedgerEntryDirection.NEUTRAL,
            description: `Creator ${currentUser.name} joined as Admin`,
            circleId: newCircle.id,
            userId: currentUser.id,
            metadata: { role: 'admin' }
        });
    } catch (e) {
        console.error("Ledger Error (Create Circle)", e);
    }

    console.log(`Created circle with ID: ${newCircle.id}. Redirecting to profile.`);

    // Small delay to ensure DB (mock) consistency if concurrent
    await new Promise(resolve => setTimeout(resolve, 500));

    redirect('/profile');
}

export async function joinCircleAction(formData: FormData) {
    const rawData = {
        circleId: formData.get("circleId") as string,
        intent: formData.get("intent") as string,
        preference: formData.get("preference") || 'any'
    };

    const validated = joinCircleSchema.safeParse(rawData);

    if (!validated.success) {
        throw new Error("Invalid join data");
    }

    const { circleId, intent, preference } = validated.data;

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Must be logged in to join");

    // Add real user to circle
    await joinCircle(circleId, currentUser, preference);

    // In a real app we might presumably log the intent somewhere
    console.log(`User joining circle ${circleId} with preference: ${preference} and intent: ${intent}`);

    // Ledger: Log Member Join
    try {
        await recordLedgerEntry({
            type: LedgerEntryType.MEMBER_JOINED,
            direction: LedgerEntryDirection.NEUTRAL,
            description: `${currentUser.name} joined the circle`,
            circleId: circleId,
            userId: currentUser.id,
            metadata: { preference, intent }
        });
    } catch (e) { console.error("Ledger join error", e); }

    redirect(`/explore?joined=true`);
}

export async function updatePayoutOrderAction(circleId: string, members: Member[]) {
    // In a real app, verify admin status here
    await updateCircleMembers(circleId, members);
    // reduce delay for smoother feel, or keep it for feedback
    await new Promise(resolve => setTimeout(resolve, 500));
}

export async function updateMemberStatusAction(circleId: string, userId: string, newStatus: 'approved' | 'rejected') {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    // In a real app we'd check admin permissions here using circle.adminId

    // Map "approved" to "pending" (meaning they are now a Pending Member awaiting payment)
    const dbStatus = newStatus === 'approved' ? 'pending' : 'rejected';

    await updateMemberStatus(circleId, userId, dbStatus);

    revalidatePath(`/circles/${circleId}`);

    revalidatePath(`/circles/${circleId}`);

    // Refresh UI
    await new Promise(resolve => setTimeout(resolve, 500));
}

export async function markContributionPaidAction(circleId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    // Fetch circle to check current status
    const { getCircle } = await import("@/lib/data"); // Dynamic import to avoid circular dependency issues if any, though likely fine
    const circle = await getCircle(circleId);
    if (!circle) throw new Error("Circle not found");

    const member = circle.members.find(m => m.userId === currentUser.id);
    if (!member) throw new Error("Not a member");

    // Only allow if status is 'pending' (which means Approved & Unpaid) or 'late'
    // explicitly BLOCK 'requested'
    if (member.status === 'requested') {
        throw new Error("Membership not approved yet");
    }

    if (member.status === 'paid' || member.status === 'paid_pending') {
        return; // Already paid or pending verification
    }

    await updateMemberStatus(circleId, currentUser.id, 'paid_pending');

    // Ledger: Log Payment Attempt
    await recordLedgerEntry({
        type: LedgerEntryType.CONTRIBUTION_MARKED_PAID,
        direction: LedgerEntryDirection.CREDIT, // "Money in" potentially
        description: `${currentUser.name} marked contribution as paid`,
        circleId: circleId,
        userId: currentUser.id,
        amount: circle.amount,
        currency: 'USD'
    });

    revalidatePath(`/circles/${circleId}`);
    revalidatePath(`/circles/${circleId}/dashboard/commitment`);
}

export async function verifyPaymentAction(circleId: string, memberId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    // In real app, check if currentUser is Admin of circleId here

    // Need amount for record
    const { getCircle } = await import("@/lib/data");
    const circle = await getCircle(circleId);
    if (!circle) return;

    await updateMemberStatus(circleId, memberId, 'paid');

    // Ledger: Log Confirmation
    await recordLedgerEntry({
        type: LedgerEntryType.CONTRIBUTION_CONFIRMED,
        direction: LedgerEntryDirection.CREDIT,
        description: `Admin confirmed payment for member`,
        circleId: circleId,
        userId: memberId,
        adminId: currentUser.id,
        amount: circle.amount
    });

    revalidatePath(`/circles/${circleId}`);
    // revalidatePath(`/circles/${circleId}/admin/members`); // If we had a specific admin page for this
}

export async function launchCircleAction(circleId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    await updateCircleStatus(circleId, 'active');

    // In a real app, this is where we'd lock in the startDate if it was floating,
    // and trigger the first round notifications.

    // Ledger: Create Obligations for ALL members for Round 1
    const { getCircle } = await import("@/lib/data");
    const circle = await getCircle(circleId);
    if (circle) {
        for (const member of circle.members) {
            await recordLedgerEntry({
                type: LedgerEntryType.CONTRIBUTION_OBLIGATION_CREATED,
                direction: LedgerEntryDirection.DEBIT, // Owed money
                description: `Round 1 Contribution Due`,
                circleId: circle.id,
                userId: member.userId,
                amount: circle.amount,
                metadata: { round: 1 }
            });
        }
    }

    revalidatePath(`/circles/${circleId}`);

    revalidatePath(`/circles/${circleId}`);
    revalidatePath(`/circles/${circleId}/dashboard`);

    // ... launchCircleAction content

    await new Promise(resolve => setTimeout(resolve, 500));
}

// --- NEW SIGNUP FLOW ACTIONS ---

export async function beginSignupAction(formData: FormData) {
    const rawPhone = formData.get('phone') as string;
    const name = formData.get('name') as string || 'Guest'; // Capture name or default
    // Normalize: If no '+', assume US (+1)
    const phone = rawPhone.startsWith('+') ? rawPhone : `+1${rawPhone.replace(/\D/g, '')}`;

    const { sendSms, generateOtp } = await import("@/lib/sms");
    const { prisma } = await import("@/lib/db");
    const { registerUser, findUserByPhone } = await import("@/lib/data");

    // Check if user exists fully
    const existing = await findUserByPhone(phone);
    if (existing && existing.name !== "Guest") {
        return { error: 'User already exists. Please Sign In.' };
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existing) {
        // Update Stub
        await prisma.user.update({
            where: { id: existing.id },
            data: { otpCode: otp, otpExpiresAt: expiresAt }
        });
    } else {
        // Create Stub
        const stubId = Math.random().toString(36).substr(2, 9);
        await registerUser({
            id: stubId,
            phoneNumber: phone,
            name: name,
            role: 'user',
            location: '',
            isBanned: false,
            trustScore: 100,
            badges: [],
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            memberSince: new Date().getFullYear().toString(),
            stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 },
            history: []
        });

        await prisma.user.update({
            where: { id: stubId },
            data: { otpCode: otp, otpExpiresAt: expiresAt }
        });
    }

    // Send SMS
    const smsResult = await sendSms(phone, `Your ROSCA signup code is: ${otp}`);

    if (!smsResult.success) {
        console.error("SMS Send Failed:", smsResult.error);
        // Return a safe error message, or specific one for debugging
        const errorMessage = (smsResult.error as any)?.message || 'Failed to send SMS.';
        return { error: `SMS Error: ${errorMessage}` };
    }

    return { success: true };
}

export async function verifySignupOtpAction(formData: FormData) {
    const { verifyOtpSchema } = await import("@/lib/schemas");
    const { prisma } = await import("@/lib/db");

    const rawData = {
        phone: formData.get('phone') as string,
        code: formData.get('code') as string
    };

    const validated = verifyOtpSchema.safeParse(rawData);
    if (!validated.success) return { error: 'Invalid code format' };

    const { phone, code } = validated.data;
    const user = await prisma.user.findUnique({ where: { phoneNumber: phone } });

    if (!user || user.otpCode !== code || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        return { error: 'Invalid or expired code' };
    }

    // Success: Clear OTP
    await prisma.user.update({
        where: { id: user.id },
        data: { otpCode: null, otpExpiresAt: null }
    });

    // Set Session (User is now "logged in" as Guest)
    (await cookies()).set('session_user_id', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return { success: true };
}

export async function completeSignupAction(formData: FormData) {
    const rawPhone = formData.get('phone') as string;
    const phone = rawPhone.startsWith('+') ? rawPhone : `+1${rawPhone.replace(/\D/g, '')}`;
    const location = formData.get('location') as string;

    const { prisma } = await import("@/lib/db");
    const { findUserByPhone } = await import("@/lib/data");
    const user = await findUserByPhone(phone);

    if (!user) {
        // Redirect to start if user lost
        redirect('/signup?error=session_expired');
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            location,
        }
    });

    redirect('/welcome');
}

export async function completeOnboardingAction() {
    const { prisma } = await import("@/lib/db");
    const { getCurrentUser } = await import("@/lib/data");

    const user = await getCurrentUser();
    if (!user) return;

    await prisma.user.update({
        where: { id: user.id },
        data: { hasCompletedOnboarding: true }
    });

    redirect('/');
}
