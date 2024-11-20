import { homedir } from 'os';
import { join } from 'path';

export function getAlksConfigFolder() {
  return join(homedir(), '.alks-cli');
}

export function getAlksLogFolder() {
  return join(getAlksConfigFolder(), 'log');
}
