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
import { RegisterDto } from '@/modules/auth/dtos/register.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';
import { MessagePresenter } from '@/common/presenters/message.presenter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Roles(Role.ADMIN)
  @ApiDocs({ response: [400, 401, 500] })
  register(
    @Body() body: RegisterDto,
    @Headers() headers: AuthenticateDto,
  ): Promise<SessionPresenter> {
    return this.authService.register(body, headers);
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
  @ApiDocs({ response: [401, 500] })
  me(@CurrentUser('id') userId: string): Promise<UserPresenter> {
    return this.authService.me(userId);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiDocs({ isPublic: true, response: [500] })
  forgotPassword(): Promise<MessagePresenter> {
    return Promise.resolve({ message: 'Email sent' });
  }
}
