import { UserI18n } from '@/infra/i18n/protocols/user-i18n';

export default {
  not_found: 'Usuário não encontrado',
  not_found_with_id: 'Usuário não encontrado com id: {userId}',
  roles: {
    ADMIN: 'Administrador',
    EMPLOYEE: 'Funcionário',
  },
} satisfies UserI18n;
