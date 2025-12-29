
import { prisma } from "../lib/db";

async function checkContent() {
    console.log("Checking DB Content...");
    try {
        const circles = await prisma.circle.findMany({
            select: { id: true, name: true, status: true, isPrivate: true }
        });
        console.log(`Found ${circles.length} circles:`);
        circles.forEach(c => console.log(`- [${c.status}] ${c.name} (Private: ${c.isPrivate})`));

        const users = await prisma.user.count();
        console.log(`Total Users: ${users}`);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkContent();
