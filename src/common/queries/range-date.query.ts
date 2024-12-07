import { DateUtils } from '@/common/helpers/date-utils.helper';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class RangeDateQuery {
  @Transform(({ value }) => DateUtils.getDate(value, 'America/Sao_Paulo'))
  @IsNotEmpty()
  @IsDate()
  from!: Date;

  @Transform(({ value }) => DateUtils.getDate(value, 'America/Sao_Paulo'))
  @IsNotEmpty()
  @IsDate()
  to!: Date;
}
