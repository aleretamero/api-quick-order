import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@/modules/user/enums/role.enum';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;
}
