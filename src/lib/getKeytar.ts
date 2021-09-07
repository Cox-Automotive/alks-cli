import { red } from 'cli-color';
import { isOsx } from './isOsx';
import { isWindows } from './isWindows';
import { log } from './log';

export async function getKeytar() {
  try {
    return await import('keytar');
  } catch (err) {
    log('failed to import keytar');
    if (!isOsx() && !isWindows()) {
      // see https://github.com/atom/node-keytar#on-linux
      console.error(
        red(
          `Please ensure that either libsecret-1-dev, libsecret-devel, or libsecret is installed, then reinstall this tool with 'npm install -g --unsafe-perm=true alks'`
        )
      );
    } else {
      console.error(
        red(
          `Please reinstall this cli with 'npm install -g --unsafe-perm=true alks'`
        )
      );
    }
    throw err;
  }
}
