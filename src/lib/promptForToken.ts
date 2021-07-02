import clc from 'cli-color';
import open from 'open';
import { getAlks, Props as AlksProps } from './getAlks';
import { getPasswordFromPrompt } from './getPasswordFromPrompt';
import { log } from './log';
import { getServer } from './state/server';

export async function promptForToken() {
  const server = await getServer();

  console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
  const url = server.replace(/rest/, 'token-management');
  try {
    await Promise.race([
      open(url, {
        newInstance: true,
      }),
      new Promise((_, rej) => {
        setTimeout(() => rej(), 5000);
      }), // timeout after 5 seconds
    ]);
  } catch (err) {
    console.error(`Failed to open ${url}`);
    console.error('Please open the url in the browser of your choice');
  }

  console.error('Please copy your refresh token from ALKS and paste below..');

  const refreshToken = await getPasswordFromPrompt('Refresh Token');
  log('exchanging refresh token for access token');

  const alks = await getAlks({} as AlksProps);

  try {
    await alks.getAccessToken({
      refreshToken,
    });
  } catch (err) {
    err.message = 'Error validating refresh token. ' + err.message;
    throw err;
  }

  console.error(clc.white('Refresh token validated!'));

  return refreshToken;
}
