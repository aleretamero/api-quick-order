import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { LoginDto } from '@/modules/auth/dtos/login.dto';
import { AuthenticateDto } from '@/modules/auth/dtos/authenticate.dto';
import { IsPublic } from '@/common/decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  login(
    @Body() body: LoginDto,
    @Headers() headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    return this.authService.login(body, headers);
  }

  @Get('me')
  me() {
    return this.authService.me('user-id');
  }
}
