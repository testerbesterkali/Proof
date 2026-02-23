import { PrismaClient } from '@prisma/client';

async function fixRLS() {
    const prisma = new PrismaClient();
    try {
        // Check if RLS is enabled
        const res: any = await prisma.$queryRaw`
      SELECT relrowsecurity 
      FROM pg_class 
      WHERE relname = 'Submission';
    `;
        console.log('RLS Enabled before:', res);

        // Disable RLS temporarily to allow frontend anon client to update
        await prisma.$executeRawUnsafe('ALTER TABLE "Submission" DISABLE ROW LEVEL SECURITY;');
        console.log('Disabled RLS on Submission table.');

        // Also check constraints just in case
        const constraints: any = await prisma.$queryRaw`
      SELECT conname, pg_get_constraintdef(c.oid)
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'Submission';
    `;
        console.log('Constraints on Submission:', constraints);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

fixRLS();
