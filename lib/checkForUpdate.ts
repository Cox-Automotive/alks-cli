import { white, blue, green } from 'cli-color';
import npm from 'npm-registry-client';
import { gt } from 'semver';
import { version, name } from '../package.json';
import { getVersionAtStart, getDeveloper, saveDeveloper } from './developer.js';
import { log as _log, showBorderedMessage } from './utils';
import path from 'path';
import fs from 'fs';

const logger = 'utils';

function noop() {}

function getChangeLog() {
  const file = path.join(__dirname, '../', 'changelog.txt');
  return fs.readFileSync(file, 'utf8');
}

export async function checkForUpdate() {
  const myVer = version;
  const app = name;
  const client = new npm({ log: { verbose: noop, info: noop, http: noop } });

  const data: any = await new Promise((resolve, reject) => {
    client.get(
      `https://registry.npmjs.org/${app}/latest`,
      { timeout: 1000 },
      (error: Error, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });

  const latestVer = data.version;
  const needsUpdate = gt(latestVer, myVer);

  _log(null, logger, 'needs update? ' + (needsUpdate ? 'yes' : 'no'));
  if (needsUpdate) {
    const msg = [
      white('Update available '),
      blue(myVer),
      white(' → '),
      green(latestVer + '\n'),
      white('Run: '),
      green('npm i -g ' + app),
      white(' to update'),
    ].join('');

    showBorderedMessage(40, msg);
  } else {
    const currentVersion = version;
    const lastRunVerion = getVersionAtStart();

    // check if they just updated
    if (lastRunVerion !== null && gt(currentVersion, lastRunVerion)) {
      _log(null, logger, 'user updated, updating db with version');
      // give them release notes
      showBorderedMessage(110, white(getChangeLog()));

      // save the last version
      const developer = await getDeveloper();
      _log(null, logger, 'db');
      developer.lastVersion = currentVersion;
      await saveDeveloper(developer);
    }
  }
}
