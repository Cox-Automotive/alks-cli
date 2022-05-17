import clc from 'cli-color';
import commander from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import { errorAndExit } from '../errorAndExit';
import { isOsx } from '../isOsx';
import { log } from '../log';
import fs from 'fs';

async function runServerDaemon() {
  console.error(clc.white('Starting metadata server..'));

  // Dynamically import forever since it is an optional dependency
  (await import('forever')).startDaemon(
    path.join(__dirname, '../lib') + '/metadata-server.js',
    {
      uid: 'alks-metadata',
      root: path.join(__dirname, '../'),
    }
  );

  console.error(clc.white('Metadata server now listening on: 169.254.169.254'));
}

export async function handleAlksServerStart(_options: commander.OptionValues) {
  try {
    if (!isOsx()) {
      errorAndExit('The metadata server is only supported on OSX.');
    }

    log('Checking if forwarding daemon is already installed..');

    if (!fs.existsSync('/etc/pf.anchors/com.coxautodev.alks')) {
      console.error(
        clc.white(
          'Installing metadata daemon rules. You may be prompted for your system password since this requires escalated privileges.'
        )
      );
      const servicePath = path.join(__dirname, '../service');

      try {
        log('Adding pf.anchor');
        execSync(
          'sudo cp ' + servicePath + '/com.coxautodev.alks /etc/pf.anchors/'
        );

        log('Adding launch daemon');
        execSync(
          'sudo cp ' +
            servicePath +
            '/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/'
        );

        log('Loading launch daemon');
        execSync(
          'sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist'
        );
      } catch (err) {
        console.log(clc.red('Error installing metadata daemon.'), err);
      }
      console.log(clc.white('Successfully installed metadata daemon.'));
      await runServerDaemon();
    } else {
      log('Daemon is already installed..');
      await runServerDaemon();
    }
  } catch (er) {
    const e = er as Error;
    errorAndExit(e.message, e);
  }
}
