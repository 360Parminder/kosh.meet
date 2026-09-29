import { prisma } from '@360parminder/db';

export { prisma };

/**
 * Health check helper to verify if the PostgreSQL database is reachable
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    return false;
  }
}
