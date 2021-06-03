import { Auth, TokenAuth } from '../model/auth';

export function isTokenAuth(auth: Auth): auth is TokenAuth {
  return Boolean((auth as TokenAuth).token);
}
