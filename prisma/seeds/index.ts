import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { usersSeed } from './users.seed';

(async function () {
  const prisma = new PrismaClient();
  try {
    await usersSeed(prisma);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
