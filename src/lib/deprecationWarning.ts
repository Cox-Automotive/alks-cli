import { red } from 'cli-color';
import { isEmpty } from 'underscore';

export function deprecationWarning(msg: string) {
  msg = `\nWarning: ${
    isEmpty(msg) ? 'This command is being deprecated.' : msg
  }`;
  console.error(red.bold(msg));
}
