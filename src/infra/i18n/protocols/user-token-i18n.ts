export interface UserTokenI18n {
  not_found_with_type: string;
  invalid_code: string;
  expired: string;
  types: {
    RESET_PASSWORD: string;
    VERIFY_EMAIL: string;
  };
}
