import c from 'clortho';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import { log } from './log';
import netrc from 'node-netrc';

const clortho = c.forService('alkscli');

const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

const logger = 'password';

export async function removePassword() {
  log(null, logger, 'removing password');
  if (isPasswordSecurelyStorable()) {
    return clortho.removeFromKeychain(ALKS_USERID);
  } else {
    netrc.update(SERVICE, {});
  }
}
