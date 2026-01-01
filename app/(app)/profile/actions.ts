'use server';

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
    location: z.string().max(50, "Location must be short").optional(),
});

export async function updateProfileAction(prevState: any, formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { message: "Unauthorized" };

    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        bio: formData.get('bio'),
        location: formData.get('location'),
    };

    const validated = profileSchema.safeParse(rawData);

    if (!validated.success) {
        const errorMsg = validated.error.issues[0]?.message || "Invalid input";
        return { message: errorMsg };
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: validated.data.name,
                email: validated.data.email || null, // Convert empty string to null
                bio: validated.data.bio,
                location: validated.data.location,
            }
        });

        revalidatePath('/profile');
        return { message: "Profile updated successfully", success: true };
    } catch (error) {
        console.error("Profile update failed:", error);
        return { message: "Failed to update profile. Email might be already in use." };
    }
}
