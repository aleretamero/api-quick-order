import { UserTokenI18n } from '@/infra/i18n/protocols/user-token-i18n';

export default {
  not_found_with_type:
    'Não foi encontrado solicitação de token do tipo: $t(user_token.types.{type})',
  invalid_code: 'Código inválido',
  expired: 'Token expirado',
  types: {
    RESET_PASSWORD: 'Redefinição de senha',
    VERIFY_EMAIL: 'Verificação de e-mail',
  },
} satisfies UserTokenI18n;
