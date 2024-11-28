import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(0)
  receivedPrice?: number;

  @Transform(({ value }) => value?.toUpperCase?.())
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
