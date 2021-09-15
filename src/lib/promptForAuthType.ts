import { getStdErrPrompt } from './getStdErrPrompt';

export const REFRESH_TOKEN_AUTH_CHOICE = 'refresh-token';
export const PASSWORD_AUTH_CHOICE = 'password';
export const ALWAYS_ASK_AUTH_CHOICE = 'always-ask';

export async function promptForAuthType(): Promise<string> {
  const promptData = {
    type: 'list',
    name: 'authType',
    default: 'refresh-token',
    message: 'Please choose an authentication type',
    choices: [
      {
        name: `[${REFRESH_TOKEN_AUTH_CHOICE}] Store an OAuth2 refresh token`,
        value: REFRESH_TOKEN_AUTH_CHOICE,
        short: REFRESH_TOKEN_AUTH_CHOICE,
      },
      {
        name: `[${PASSWORD_AUTH_CHOICE}] Store your network password (not recommended)`,
        value: PASSWORD_AUTH_CHOICE,
        short: PASSWORD_AUTH_CHOICE,
      },
      {
        name: `[${ALWAYS_ASK_AUTH_CHOICE}] Ask for your password every time`,
        value: ALWAYS_ASK_AUTH_CHOICE,
        short: ALWAYS_ASK_AUTH_CHOICE,
      },
    ],
    pageSize: 10,
  };

  const answers = await getStdErrPrompt()([promptData]);

  return answers.authType;
}
