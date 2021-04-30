import c from 'clortho';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import { log } from './log';
import netrc from 'node-netrc';

const clortho = c.forService('alkscli');
const SERVICETKN = 'alksclitoken';
const ALKS_TOKEN = 'alkstoken';

const logger = 'token';

export async function removeToken() {
  log(null, logger, 'removing token');
  if (isPasswordSecurelyStorable()) {
    return clortho.removeFromKeychain(ALKS_TOKEN);
  } else {
    netrc.update(SERVICETKN, {});
  }
}
