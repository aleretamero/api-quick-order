import { User } from '@prisma/client';

type UserPresenterProps = User;

export class UserPresenter {
  constructor(private readonly props: UserPresenterProps) {}

  toJSON() {
    return {
      id: this.props.id,
      email: this.props.email,
      role: this.props.role,
    };
  }
}
