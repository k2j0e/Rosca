import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const phoneNumber = process.argv[2];

    if (!phoneNumber) {
        console.error('Please provide a phone number: npx tsx scripts/make-admin.ts "+15550109999"');
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { phoneNumber },
            data: { role: 'platform_admin' },
        });
        console.log(`✅ Successfully promoted ${user.name} (${user.phoneNumber}) to platform_admin.`);
    } catch (error) {
        console.error('Error updating user:', error);
        console.log('User not found? Make sure you signed up first.');
    } finally {
        await prisma.$disconnect();
    }
}

main();
