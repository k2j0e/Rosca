import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
    const email = "aloosycrypto@protonmail.com";
    // Very simple password (temporary)
    const newPassword = "admin";

    const hashedPassword = await hashPassword(newPassword);

    console.log(`Resetting password for ${email} to 'admin'...`);
    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword
        }
    });

    console.log("✅ Password reset to: admin");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
