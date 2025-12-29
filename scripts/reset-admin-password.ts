
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/password';

const prisma = new PrismaClient();

async function main() {
    const email = "aloosycrypto@protonmail.com";
    const newPassword = "admin"; // Simple for testing

    console.log(`Resetting password for: ${email}...`);

    const hashedPassword = await hashPassword(newPassword);

    try {
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log(`✅ Password successfully reset to: '${newPassword}'`);
    } catch (error) {
        console.error("❌ Failed to reset password:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
