
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const phone = process.argv[2];
    if (!phone) {
        console.error("Please provide a phone number");
        process.exit(1);
    }

    console.log(`Searching for user with phone: ${phone}`);
    const user = await prisma.user.findFirst({
        where: { phoneNumber: phone }
    });

    if (user) {
        console.log("User found:", user);
    } else {
        console.log("User NOT found.");
        // Try fuzzy search
        const fuzzy = await prisma.user.findFirst({
            where: { phoneNumber: { contains: phone.replace('+1', '') } }
        });
        if (fuzzy) {
            console.log("Did you mean:", fuzzy);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
