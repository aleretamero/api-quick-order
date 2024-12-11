import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function usersSeed(prisma: PrismaClient) {
  const usersData: Prisma.UserCreateInput[] = [
    {
      email: process.env.ADMIN_EMAIL!,
      hashedPassword: await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10),
      role: 'ADMIN',
    },
    {
      email: 'user@email.com',
      hashedPassword: await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10),
      role: 'EMPLOYEE',
    },
  ];

  await prisma.$transaction(async (ctx) => {
    for (const data of usersData) {
      const user = await ctx.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (user) {
        console.log(`User with email ${data.email} already exists`);
        continue;
      }

      await ctx.user.create({ data });

      console.log(`User with email ${data.email} created`);
    }
  });
}
