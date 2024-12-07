import { Decimal } from '@prisma/client/runtime/library';

export type OrdersCompletedQueryRaw = {
  date: string;
  value: Decimal | null;
  quantity: number;
};
