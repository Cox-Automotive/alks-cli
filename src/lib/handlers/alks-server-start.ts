import clc from 'cli-color';
import commander from 'commander';
import { execSync, spawn } from 'child_process';
import path from 'path';
import { errorAndExit } from '../errorAndExit';
import { isOsx } from '../isOsx';
import { log } from '../log';
import fs from 'fs';
import os from 'os';

const PID_FILE = path.join(os.tmpdir(), 'alks-metadata-server.pid');
const LOG_FILE = path.join(os.homedir(), '.alks', 'metadata-server.log');

async function runServerDaemon() {
  console.error(clc.white('Starting metadata server..'));

  // Ensure .alks directory exists
  const alksDir = path.join(os.homedir(), '.alks');
  if (!fs.existsSync(alksDir)) {
    fs.mkdirSync(alksDir, { recursive: true });
  }

  const serverPath = path.join(__dirname, '../metadata-server.js');

  // Spawn the server as a detached process
  const logStream = fs.openSync(LOG_FILE, 'a');
  const server = spawn('node', [serverPath], {
    detached: true,
    stdio: ['ignore', logStream, logStream],
  });

  // Write PID file
  fs.writeFileSync(PID_FILE, server.pid!.toString(), 'utf8');

  // Unref so parent can exit
  server.unref();

  // Give it a moment to start
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.error(clc.white('Metadata server now listening on: 169.254.169.254'));
  console.error(clc.white(`Server logs: ${LOG_FILE}`));
}

export async function handleAlksServerStart(_options: commander.OptionValues) {
  try {
    if (!isOsx()) {
      errorAndExit('The metadata server is only supported on OSX.');
    }

    log('Checking if forwarding daemon is installed..');

    const anchorExists = fs.existsSync('/etc/pf.anchors/com.coxautodev.alks');
    const plistExists = fs.existsSync(
      '/Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist'
    );

    // Install files if they don't exist
    if (!anchorExists || !plistExists) {
      console.error(
        clc.white(
          'Installing metadata daemon rules. You may be prompted for your system password since this requires escalated privileges.'
        )
      );
      const servicePath = path.join(__dirname, '../../../../service');

      try {
        if (!anchorExists) {
          log('Adding pf.anchor');
          execSync(
            'sudo cp ' + servicePath + '/com.coxautodev.alks /etc/pf.anchors/'
          );
        }

        if (!plistExists) {
          log('Adding launch daemon');
          execSync(
            'sudo cp ' +
              servicePath +
              '/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/'
          );
        }
      } catch (err) {
        console.log(clc.red('Error installing metadata daemon.'), err);
      }
      console.log(clc.white('Successfully installed metadata daemon files.'));
    }

    // Ensure daemon is loaded
    if (plistExists || !anchorExists) {
      console.error(
        clc.white(
          'Ensuring metadata daemon is loaded. You may be prompted for your system password.'
        )
      );
      try {
        log('Loading launch daemon..');
        // Try modern bootstrap command first (macOS 10.11+)
        try {
          execSync(
            'sudo launchctl bootstrap system /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist 2>&1',
            { encoding: 'utf-8' }
          );
          log('Launch daemon loaded successfully.');
        } catch (bootstrapErr) {
          const errMsg =
            (bootstrapErr as any).stderr || (bootstrapErr as any).stdout || '';
          // If already loaded or service is running, that's fine
          if (
            errMsg.includes('Already loaded') ||
            errMsg.includes('service is running')
          ) {
            log('Launch daemon is already running.');
          } else {
            // Fall back to legacy load command
            execSync(
              'sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist 2>&1',
              { encoding: 'utf-8' }
            );
            log('Launch daemon loaded successfully.');
          }
        }
      } catch (err) {
        const errMsg =
          (err as any).stderr ||
          (err as any).stdout ||
          (err as any).message ||
          '';
        if (
          errMsg.includes('Already loaded') ||
          errMsg.includes('service is running')
        ) {
          log('Launch daemon is already running.');
        } else {
          console.log(clc.red('Error loading metadata daemon:'), errMsg);
        }
      }
    }

    await runServerDaemon();
  } catch (er) {
    const e = er as Error;
    errorAndExit(e.message, e);
  }
}
