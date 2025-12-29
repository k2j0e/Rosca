import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = "aloosycrypto@protonmail.com";
    const correctPhone = "7786832277";

    console.log(`Fixing phone number for user with email: ${email}`);

    const user = await prisma.user.update({
        where: { email },
        data: {
            phoneNumber: correctPhone
        }
    });

    console.log("✅ Fixed User Record:", user);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
