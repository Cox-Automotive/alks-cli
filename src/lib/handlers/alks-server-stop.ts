import clc from 'cli-color';
import commander from 'commander';
import { isOsx } from '../isOsx';
import fs from 'fs';
import path from 'path';
import os from 'os';

const PID_FILE = path.join(os.tmpdir(), 'alks-metadata-server.pid');

export async function handleAlksServerStop(_options: commander.OptionValues) {
  if (!isOsx()) {
    console.error(clc.red('The metadata server is only supported on OSX.'));
    process.exit(0);
  }

  console.error(clc.white('Stopping metadata server..'));

  try {
    if (!fs.existsSync(PID_FILE)) {
      console.log(clc.white('Metadata server is not running.'));
      return;
    }

    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);

    // Check if process exists
    try {
      process.kill(pid, 0); // Signal 0 checks if process exists
      // Process exists, kill it
      process.kill(pid, 'SIGTERM');
      fs.unlinkSync(PID_FILE);
      console.log(clc.white('Metadata server stopped.'));
    } catch (err) {
      // Process doesn't exist, remove stale PID file
      fs.unlinkSync(PID_FILE);
      console.log(clc.white('Metadata server is not running.'));
    }
  } catch (err) {
    console.error(clc.red('Error stopping metadata server:'), err);
  }
}
