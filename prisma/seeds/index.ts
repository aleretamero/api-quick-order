import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { usersSeed } from './users.seed';
import { fakeOrdersSeed } from './fake-orders.seed';

(async function () {
  const prisma = new PrismaClient();
  try {
    await usersSeed(prisma);
    await fakeOrdersSeed(prisma);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
