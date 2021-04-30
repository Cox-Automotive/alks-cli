import { version } from '../../package.json';

export function getUserAgentString() {
  return `alks-cli/${version}`;
}
