import { AuthI18n } from '@/infra/i18n/protocols/auth-i18n';
import { DeviceI18n } from '@/infra/i18n/protocols/device-i18n';
import { UserI18n } from '@/infra/i18n/protocols/user-i18n';
import { UserTokenI18n } from '@/infra/i18n/protocols/user-token-i18n';

export interface I18nTranslations {
  device: DeviceI18n;
  auth: AuthI18n;
  user: UserI18n;
  user_token: UserTokenI18n;
}
