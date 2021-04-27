const clc = require('cli-color');
const npm = require('npm-registry-client');
const semVer = require('semver');
const config = require('../package.json');
const Dev = require('./developer.js');
const utils = require('./utils');

const logger = 'utils';

function noop() {}

function getChangeLog() {
  const file = path.join(__dirname, '../', 'changelog.txt');
  return fs.readFileSync(file, 'utf8');
}

exports.checkForUpdate = async function checkForUpdate() {
  const myVer = config.version;
  const app = config.name;
  let noCB = false;
  const client = new npm({ log: { verbose: noop, info: noop, http: noop } });

  const data = await new Promise((resolve, reject) => {
    client.get(
      `https://registry.npmjs.org/${app}/latest`,
      { timeout: 1000 },
      (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });

  const latestVer = data.version;
  const needsUpdate = semVer.gt(latestVer, myVer);

  utils.log(null, logger, 'needs update? ' + (needsUpdate ? 'yes' : 'no'));
  if (needsUpdate) {
    const msg = [
      clc.white('Update available '),
      clc.blue(myVer),
      clc.white(' → '),
      clc.green(latestVer + '\n'),
      clc.white('Run: '),
      clc.green('npm i -g ' + app),
      clc.white(' to update'),
    ].join('');

    utils.showBorderedMessage(40, msg);
  } else {
    const currentVersion = config.version;
    const lastRunVerion = Dev.getVersionAtStart();

    // check if they just updated
    if (lastRunVerion !== null && semVer.gt(currentVersion, lastRunVerion)) {
      utils.log(null, logger, 'user updated, updating db with version');
      // give them release notes
      utils.showBorderedMessage(110, clc.white(getChangeLog()));

      // save the last version
      const developer = await Dev.getDeveloper();
      noCB = true;
      utils.log(null, logger, 'db');
      developer.lastVersion = currentVersion;
      await Dev.saveDeveloper(developer);
    }
  }
};
