export interface TokenAuth {
  token: string;
}

export interface PasswordAuth {
  userid: string;
  password: string;
}

export type Auth = TokenAuth | PasswordAuth;
