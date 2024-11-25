import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login() {
    return this.authService.login();
  }
}
