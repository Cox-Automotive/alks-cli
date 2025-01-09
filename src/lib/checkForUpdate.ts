import { white, blue, green } from 'cli-color';
import fetch from 'npm-registry-fetch';
import { gt } from 'semver';
import { version, name } from '../../package.json';
import path from 'path';
import fs from 'fs';
import { log } from './log';
import { showBorderedMessage } from './showBorderedMessage';
import { getLastVersion, setLastVersion } from './state/lastVersion';

function getChangeLog() {
  const file = path.join(__dirname, '../../', 'changelog.txt');
  return fs.readFileSync(file, 'utf8');
}

export async function checkForUpdate() {
  const success = await Promise.race([
    checkForUpdateInternal().then(() => true),
    // Force a timeout of 1 second
    new Promise((resolve) => {
      setTimeout(resolve.bind(null, false), 1000);
    }),
  ]);

  if (!success) {
    log('check for update timed out. Skipping...');
  }
}

async function checkForUpdateInternal() {
  log('checking for update...');

  const currentVersion = version;
  const app = name;

  const response = await fetch(`https://registry.npmjs.org/${app}/latest`, {
    timeout: 1000,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

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
