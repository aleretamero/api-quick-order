import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  description!: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salePrice!: number;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  receivedPrice!: number;
}
