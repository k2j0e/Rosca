
import { z } from 'zod';

// --- Auth Schemas ---

export const phoneSchema = z.string()
    .min(10, "Phone number is too short")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164)");

export const signInSchema = z.object({
    phone: phoneSchema
});

export const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
    phone: phoneSchema,
    location: z.string().optional()
});

export const verifyOtpSchema = z.object({
    phone: phoneSchema,
    code: z.string().length(6, "Code must be 6 digits")
});

// --- Circle Schemas ---

export const createCircleSchema = z.object({
    name: z.string().min(3, "Circle name must be at least 3 characters").max(50),
    category: z.enum(["Travel", "Business", "Emergency", "Education", "Home Improvement", "Debt Consolidation", "Wedding", "Gadgets", "Health/Medical", "Vehicle", "Other"]),
    amount: z.number().min(5, "Contribution must be at least $5").max(10000, "Contribution limit exceeded"),
    membersCount: z.number().int().min(2, "Minimum 2 members").max(50, "Maximum 50 members"),
    frequency: z.enum(["weekly", "monthly", "bi-weekly"]),
    privacy: z.enum(["public", "private"]),
    description: z.string().max(500).optional(),
    rules: z.array(z.string()).optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    payoutSchedule: z.array(z.string()).optional()
});

export const joinCircleSchema = z.object({
    circleId: z.string().uuid(),
    intent: z.string().optional(),
    preference: z.enum(['early', 'late', 'any']).default('any')
});
