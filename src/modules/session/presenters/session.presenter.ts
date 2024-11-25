interface SessionPresenterProps {
  accessToken: string;
  refreshToken: string;
}

export class SessionPresenter {
  accessToken: string;
  refreshToken: string;

  constructor(props: SessionPresenterProps) {
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }
}
