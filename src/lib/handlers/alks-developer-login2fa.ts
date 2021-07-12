import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks, Props as AlksProps } from '../getAlks';
import { getPasswordFromPrompt } from '../getPasswordFromPrompt';
import { log } from '../log';
import { trackActivity } from '../trackActivity';
import open from 'open';
import { getServer } from '../state/server';
import { saveToken } from '../saveToken';

export async function handleAlksDeveloperLogin2fa(
  _options: commander.OptionValues
) {
  try {
    const server = await getServer();

    console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
    const url = server.replace(/rest/, 'token-management');
    console.error(
      `If the 2FA page does not open, please visit ${clc.underline(url)}`
    );
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
      errorAndExit('Error validating refresh token. ' + err.message);
    }

    console.error(clc.white('Refresh token validated!'));
    await saveToken(refreshToken);

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();

    setTimeout(() => {
      process.exit(0);
    }, 1000); // needed for if browser is still open
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
