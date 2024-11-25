import { Role } from '@/modules/user/enums/role.enum';
import { PrismaClient, Prisma } from '@prisma/client';

export async function usersSeed(prisma: PrismaClient) {
  const usersData: Prisma.UserCreateInput[] = [
    {
      id: 'user-id', // TODO: generate id
      email: 'admin@quickorder.com', // TODO: use environment variable
      hashedPassword: 'hashed-password', // TODO: hash password
      role: Role.ADMIN,
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
