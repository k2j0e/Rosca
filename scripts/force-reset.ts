import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
    const email = "aloosycrypto@protonmail.com";
    const targetPhone = "7786832277";
    const newPassword = "Password!3";

    // 1. Find who has the phone number
    const phoneHolder = await prisma.user.findUnique({
        where: { phoneNumber: targetPhone }
    });

    if (phoneHolder) {
        console.log(`⚠️ User ALREADY exists with phone ${targetPhone}:`, phoneHolder.id, phoneHolder.name);

        // If this is NOT the email user, we have a conflict.
        if (phoneHolder.email !== email) {
            console.log("This is a DIFFERENT user ID. Renaming old user to avoid conflict...");
            await prisma.user.update({
                where: { id: phoneHolder.id },
                data: { phoneNumber: `${targetPhone}-OLD-${Date.now()}` }
            });
        }
    }

    // 2. Update the Admin User (Fix Phone AND Reset Password)
    const hashedPassword = await hashPassword(newPassword);

    console.log(`Resetting password and phone for ${email}...`);
    const updatedUser = await prisma.user.update({
        where: { email },
        data: {
            phoneNumber: targetPhone,
            password: hashedPassword
        }
    });

    console.log("✅ Credentials Reset Successfully:", updatedUser);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
