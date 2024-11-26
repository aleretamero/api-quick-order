import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { LoginDto } from '@/modules/auth/dtos/login.dto';
import { AuthenticateDto } from '@/modules/auth/dtos/authenticate.dto';
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { ApiDocs } from '@/common/decorators/api-docs.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  @ApiDocs({ isPublic: true, response: [500] })
  register(): Promise<SessionPresenter> {
    return Promise.resolve({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });
  }

  @Post('login')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiDocs({ isPublic: true, response: [400, 401, 500] })
  login(
    @Body() body: LoginDto,
    @Headers() headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    return this.authService.login(body, headers);
  }

  @Get('me')
  @ApiDocs({ isPublic: true, response: [401, 500] })
  me(@CurrentUser('id') userId: string): Promise<UserPresenter> {
    return this.authService.me(userId);
  }
}
