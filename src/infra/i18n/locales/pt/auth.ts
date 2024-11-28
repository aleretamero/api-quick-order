import { AuthI18n } from '@/infra/i18n/protocols/auth-i18n';

export default {
  email_sent_to_reset_password: 'Email enviado para redefinir a senha',
  invalid_token: 'Token inválido',
  invalid_credentials: 'Credenciais inválidas',
  email_already_exists: 'Email já cadastrado',
  forbidden_for_role: 'Acesso negado para o cargo $t(user.roles.{role})',
  logged_out: 'Deslogado com sucesso',
  session: {
    not_found: 'Sessão não encontrada',
    expired: 'Sessão expirada',
  },
} satisfies AuthI18n;
