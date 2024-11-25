import { Module } from '@nestjs/common';
import { JwtModule as DefaultJwtModule } from '@nestjs/jwt';
import { JwtService } from '@/infra/jwt/jwt.service';

@Module({
  imports: [DefaultJwtModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
