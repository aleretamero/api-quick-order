import { Injectable } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(mailOptions: ISendMailOptions): Promise<void> {
    await this.mailerService.sendMail(mailOptions);
  }
}
