import { white, blue, green } from 'cli-color';
import npm from 'npm-registry-client';
import { gt } from 'semver';
import { version, name } from '../../package.json';
import path from 'path';
import fs from 'fs';
import { log } from './log';
import { showBorderedMessage } from './showBorderedMessage';
import { getLastVersion, setLastVersion } from './state/lastVersion';

function noop() {}

function getChangeLog() {
  const file = path.join(__dirname, '../../', 'changelog.txt');
  return fs.readFileSync(file, 'utf8');
}

export async function checkForUpdate() {
  const currentVersion = version;
  const app = name;
  const client = new npm({ log: { verbose: noop, info: noop, http: noop } });

  const data: { version: string } = await new Promise((resolve, reject) => {
    client.get(
      `https://registry.npmjs.org/${app}/latest`,
      { timeout: 1000 },
      (error: Error, data: { version: string }) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });

  const latestVersion = data.version;
  const needsUpdate = gt(latestVersion, currentVersion);

  log('needs update? ' + (needsUpdate ? 'yes' : 'no'));
  if (needsUpdate) {
    const msg = [
      white('Update available '),
      blue(currentVersion),
      white(' → '),
      green(latestVersion + '\n'),
      white('Run: '),
      green('npm i -g ' + app),
      white(' to update'),
    ].join('');

    showBorderedMessage(40, msg);
  } else {
    const lastVersion = await getLastVersion();

    // check if they just updated
    if (gt(currentVersion, lastVersion)) {
      log('user updated, updating db with version');
      // give them release notes
      showBorderedMessage(110, white(getChangeLog()));

      // update the state to reflect that the last version run is the current version
      log('db');
      await setLastVersion(currentVersion);
    }
  }
}
