import { getStdErrPrompt } from './getStdErrPrompt';

export async function promptForAuthType(): Promise<string> {
  const promptData = {
    type: 'list',
    name: 'authType',
    default: 'OAuth2 Refresh Token',
    message: 'Please choose an authentication type',
    choices: ['OAuth2 Refresh Token', 'Username/Password (not recommended)'],
    pageSize: 10,
  };

  const answers = await getStdErrPrompt()([promptData]);

  return answers.authType;
}
