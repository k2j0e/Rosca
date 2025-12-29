"use server";

import { createCircle, Circle, joinCircle, MOCK_USER, deleteUserSession, updateUser, getCurrentUser, User, findUserByPhone, registerUser, updateCircleMembers, Member, updateMemberStatus, updateCircleStatus } from "@/lib/data";
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

export async function signInAction(formData: FormData) {
    const phone = formData.get('phone') as string;
    // const otp = formData.get('otp') as string; // Verify OTP in real app

    if (!phone) {
        redirect('/signin?error=missing_phone');
    }

    const user = await findUserByPhone(phone);

    if (user) {
        // Login successful
        (await cookies()).set('session_user_id', user.id, { path: '/' });

        // Add delay to ensure persistence before redirect
        await new Promise(resolve => setTimeout(resolve, 500));
        redirect('/');
    } else {
        // User not found
        console.log(`User not found for phone: ${phone}`);
        redirect('/signup?error=user_not_found');
    }
}

export async function checkUserExistsAction(phone: string) {
    console.log(`[Action] Checking if user exists for phone: ${phone}`);
    const user = await findUserByPhone(phone);
    console.log(`[Action] User found: ${!!user} (ID: ${user?.id})`);
    return !!user;
}

export async function createAccountAction(formData: FormData) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;

    if (!name || !phone) return;

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
        badges: [],
        stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 },
        history: []
    };

    // 1. Save to Registry (Permanent storage)
    await registerUser(newUser);

    // 2. Set as Current Session (Log them in)
    (await cookies()).set('session_user_id', newUser.id, { path: '/' });

    // Small delay to ensure DB consistency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Redirect to home as requested
    redirect('/');
}

export async function createCircleAction(formData: FormData) {
    const name = formData.get("name") as string;
    const category = formData.get("category") as CircleCategory;
    const amount = Number(formData.get("amount"));
    const membersCount = Number(formData.get("membersCount"));

    // Convert "Weekly" -> "weekly" to match type
    const rawFreq = (formData.get("frequency") as string || "Monthly").toLowerCase();
    const frequency = rawFreq as 'weekly' | 'monthly' | 'bi-weekly';

    const privacy = formData.get("privacy") as "public" | "private";


    console.log("Creating circle with:", { name, category, amount, membersCount, frequency });

    if (!name) throw new Error("Name is required");
    if (!amount || isNaN(amount)) throw new Error("Valid amount is required");
    if (!membersCount || isNaN(membersCount)) throw new Error("Valid members count is required");


    const description = formData.get("description") as string;
    const rules = JSON.parse(formData.get("rules") as string || "[]");
    const coverImage = formData.get("coverImage") as string;

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

    console.log(`Created circle with ID: ${newCircle.id}. Redirecting to profile.`);

    // Small delay to ensure DB (mock) consistency if concurrent
    await new Promise(resolve => setTimeout(resolve, 500));

    redirect('/profile');
}

export async function joinCircleAction(formData: FormData) {
    const circleId = formData.get("circleId") as string;
    const intent = formData.get("intent") as string;
    const preference = (formData.get("preference") as 'early' | 'late' | 'any') || 'any';

    if (!circleId) {
        throw new Error("Circle ID is required");
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Must be logged in to join");

    // Add real user to circle
    await joinCircle(circleId, currentUser, preference);

    // In a real app we might presumably log the intent somewhere
    console.log(`User joining circle ${circleId} with preference: ${preference} and intent: ${intent}`);

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
    revalidatePath(`/circles/${circleId}`);
    revalidatePath(`/circles/${circleId}/dashboard/commitment`);
}

export async function verifyPaymentAction(circleId: string, memberId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    // In real app, check if currentUser is Admin of circleId here

    await updateMemberStatus(circleId, memberId, 'paid');
    revalidatePath(`/circles/${circleId}`);
    // revalidatePath(`/circles/${circleId}/admin/members`); // If we had a specific admin page for this
}

export async function launchCircleAction(circleId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    await updateCircleStatus(circleId, 'active');

    // In a real app, this is where we'd lock in the startDate if it was floating,
    // and trigger the first round notifications.

    revalidatePath(`/circles/${circleId}`);
    revalidatePath(`/circles/${circleId}/dashboard`);

    await new Promise(resolve => setTimeout(resolve, 500));
}
