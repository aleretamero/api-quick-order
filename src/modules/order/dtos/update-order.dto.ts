import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateOrderSchema extends UpdateOrderDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  file?: any;
}
