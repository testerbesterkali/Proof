import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    // Add seed logic here
}

main().catch(console.error).finally(() => prisma.$disconnect());
