import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { LoginDto } from '@/modules/auth/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto): Promise<SessionPresenter> {
    return this.authService.login(body);
  }
}
