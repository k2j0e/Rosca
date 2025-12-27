import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    const amara = await prisma.user.upsert({
        where: { phoneNumber: '+15550109999' },
        update: {},
        create: {
            phoneNumber: '+15550109999',
            name: 'Amara Okafor',
            location: 'Lagos, Nigeria',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAasS-Tm_0L0SFa0loHUoMYYrgYAhVY6aD55T5IzbsW5tY6QKzBpccqQxkDa2UQvXpDcmXhKqnTvip2i8-944CMV65YQqlQegt_yuCR8bgCDTiCWVnCtCBu2rprE8gkgl5O663fgkcJbtR-oANpt1bbRGfiLudMWnzj1y_lPeM5_SGN2ovBXOBH3qUS3wZuVLFW8iAORYRPdCNKsOwut1-soe4EkwaDS8qa-RpFXfI6qjV_Au7mt_0he_V1B-vdlJkVxiO3K_2sDfZO',
            trustScore: 850,
            badges: ['early-backer', 'consistent', 'guide'],
            stats: {
                circlesCompleted: 3,
                onTimePercentage: 98,
                supportCount: 8
            },
            history: [
                {
                    id: 'h1',
                    type: 'contribution',
                    title: 'Contribution made',
                    subtitle: 'Family Vacation Circle · Week 4',
                    timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
                }
            ]
        },
    })

    console.log(`Created user with id: ${amara.id}`)

    // Create a sample circle
    const circle = await prisma.circle.create({
        data: {
            name: 'Family Vacation Fund',
            category: 'Travel',
            amount: 200,
            frequency: 'monthly',
            duration: 10,
            maxMembers: 10,
            payoutTotal: 2000,
            startDate: new Date(),
            description: 'Saving for the big trip in December!',
            adminId: amara.id,
            status: 'active',
            members: {
                create: {
                    userId: amara.id,
                    role: 'admin',
                    status: 'paid',
                    joinedAt: new Date()
                }
            },
            events: {
                create: {
                    type: 'info',
                    message: 'Circle created by Amara',
                }
            }
        }
    })

    console.log(`Created circle with id: ${circle.id}`)
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
