import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = "aloosycrypto@protonmail.com";

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, role: true, name: true, phoneNumber: true }
    });

    if (user) {
        console.log("✅ User found:", user);
    } else {
        console.log("❌ User NOT found with that email.");
        // Check by phone
        const phoneUser = await prisma.user.findUnique({
            where: { phoneNumber: "7786832277" }
        });
        if (phoneUser) {
            console.log("ℹ️ User exists by phone, but email not set:", phoneUser);
        } else {
            console.log("❌ User does not exist by phone either.");
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
