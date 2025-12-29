import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];
    const phoneNumber = process.argv[4];

    if (!email || !password || !phoneNumber) {
        console.error('Usage: npx tsx scripts/create-admin-user.ts <EMAIL> <PASSWORD> <PHONE_NUMBER>');
        process.exit(1);
    }

    try {
        const hashedPassword = await hashPassword(password);

        // Try to find existing user first
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber }
        });

        if (existingUser) {
            console.log(`Updating existing user ${existingUser.name}...`);
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    email,
                    password: hashedPassword,
                    role: 'platform_admin'
                }
            });
        } else {
            console.log(`Creating new admin user...`);
            await prisma.user.create({
                data: {
                    phoneNumber,
                    email,
                    password: hashedPassword,
                    name: 'System Admin',
                    role: 'platform_admin',
                    trustScore: 999
                }
            });
        }

        console.log(`✅ Admin user configured!`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Role: platform_admin`);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
