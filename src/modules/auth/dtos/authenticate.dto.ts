import { IsOptional, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsOptional()
  @IsString()
  'x-fingerprint'?: string;
}
