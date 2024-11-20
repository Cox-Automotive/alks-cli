import { isOsx } from './isOsx';
import { isWindows } from './isWindows';
import { log } from './log';

export async function getKeytar() {
  try {
    return await import('keytar');
  } catch (err) {
    log(`failed to import keytar: ${err}`);
    if (!isOsx() && !isWindows()) {
      // see https://github.com/atom/node-keytar#on-linux
      throw new Error(
        `Please ensure that either libsecret-1-dev, libsecret-devel, or libsecret is installed, then reinstall this tool with 'npm install -g --unsafe-perm=true alks'`
      );
    } else {
      throw new Error(
        `Please reinstall this cli with 'npm install -g --unsafe-perm=true alks'`
      );
    }
  }
}
