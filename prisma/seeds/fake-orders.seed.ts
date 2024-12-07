import { PrismaClient } from '@prisma/client';
import { OrderStatus } from '../../src/modules/order/enums/order-status.enum';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

export async function fakeOrdersSeed(prisma: PrismaClient) {
  // const month = '2024-11';

  // const startDate = dayjs(month).startOf('month');
  // const endDate = dayjs(month).endOf('month');

  const startDate = dayjs('2024-10-01');
  const endDate = dayjs('2024-12-07');

  const status: OrderStatus[] = [
    OrderStatus.CANCELED,
    OrderStatus.COMPLETED,
    OrderStatus.PENDING,
    OrderStatus.PROCESSING,
    OrderStatus.DELETED,
  ];

  for (
    let date = startDate;
    date.isBefore(endDate);
    date = date.add(1, 'day')
  ) {
    const ordersForDay = Math.floor(Math.random() * 40);

    const orders = Array.from({ length: ordersForDay }).map(() => {
      const day = date.toDate();

      return {
        date: day,
        status: faker.helpers.arrayElement(status),
        imageUrl: 'https://picsum.photos/400/600',
        description: faker.commerce.productDescription(),
        salePrice: faker.commerce.price({ min: 10, max: 300 }),
        receivedPrice: faker.commerce.price({ min: 10, max: 300 }),
        createdAt: day,
        updatedAt: day,
      };
    });

    if (orders.length > 0) {
      await prisma.order.createMany({ data: orders });
      console.log(
        `Created ${orders.length} orders for ${date.format('YYYY-MM-DD')}`,
      );
    }
  }
}
