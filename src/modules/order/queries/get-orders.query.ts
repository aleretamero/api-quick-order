import { DateUtils } from '@/common/helpers/date-utils.helper';
import { PaginationQuery } from '@/common/queries/pagination.query';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

export class GetOrdersQueryPagination extends PaginationQuery {
  @Transform(({ value }) => DateUtils.getDate(value, 'America/Sao_Paulo'))
  @IsOptional()
  @IsDate()
  from?: Date;

  @Transform(({ value }) => DateUtils.getDate(value, 'America/Sao_Paulo'))
  @IsOptional()
  @IsDate()
  to?: Date;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return value;
  })
  @IsOptional()
  @IsEnum(OrderStatus, { each: true })
  status?: OrderStatus[];
}
