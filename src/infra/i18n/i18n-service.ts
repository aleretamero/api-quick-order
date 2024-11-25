import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nContext, I18nService as nestjsI18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/infra/i18n/protocols';

type Args =
  | (
      | string
      | {
          [k: string]: any;
        }
    )[]
  | {
      [k: string]: any;
    };

@Injectable()
export class I18nService {
  constructor(public readonly i18n: nestjsI18nService<I18nTranslations>) {}

  public getLanguage(): string {
    const lang = I18nContext.current()?.lang;

    if (!lang || lang === 'pt') {
      return 'pt-BR';
    }

    return lang;
  }

  public t(value: PathImpl2<I18nTranslations>, args?: Args): string {
    return this.i18n.t(value, {
      lang: I18nContext.current()?.lang,
      args,
    });
  }
}
