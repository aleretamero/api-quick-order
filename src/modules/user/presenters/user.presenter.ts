import { Role } from '@/modules/user/enums/role.enum';
import { User } from '@prisma/client';

type UserPresenterProps = User;

export class UserPresenter {
  id: string;
  email: string;
  role: Role;

  constructor(props: UserPresenterProps) {
    this.id = props.id;
    this.email = props.email;
    this.role = props.role as Role;
  }
}
