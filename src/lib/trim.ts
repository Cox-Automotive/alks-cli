import { isEmpty } from 'underscore';

export function trim(str: string) {
  if (isEmpty(str)) {
    return str;
  }
  return String(str).trim();
}
