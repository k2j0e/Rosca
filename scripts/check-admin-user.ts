
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = "aloosycrypto@protonmail.com";
    console.log(`Checking for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, role: true, password: true, phoneNumber: true }
    });

    if (user) {
        console.log("✅ User Found:");
        console.log(`- ID: ${user.id}`);
        console.log(`- Role: ${user.role}`);
        console.log(`- Has Password: ${user.password ? "YES (Hashed)" : "NO"}`);
        console.log(`- Phone: ${user.phoneNumber}`);
    } else {
        console.error("❌ User NOT found in database.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
