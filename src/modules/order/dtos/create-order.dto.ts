import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salePrice!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  receivedPrice!: number;

  @IsNotEmpty()
  @IsString()
  image!: string;
}
