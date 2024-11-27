import * as path from 'node:path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from '@/infra/mail/mail.service';
import { EnvService } from '@/infra/env/env.service';
import { EnvModule } from '@/infra/env/env.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (envService: EnvService) => ({
        transport: {
          host: envService.MAIL_HOST,
          port: envService.MAIL_PORT,
          auth: {
            user: envService.MAIL_USER,
            pass: envService.MAIL_PASS,
          },
        },
        defaults: {
          from: `"No Reply" <${envService.MAIL_DEFAULT_FROM_EMAIL}>`,
        },
        preview: true,
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: path.join(__dirname, 'templates/partials'),
            options: {
              strict: true,
            },
          },
        },
      }),

      inject: [EnvService],
      imports: [EnvModule],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
