import c from 'clortho';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import { log } from './log';
import netrc from 'node-netrc';
import chmod from 'chmod';
import { getFilePathInHome } from './getFilePathInHome';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';

const clortho = c.forService('alkscli');

const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

const logger = 'password';

export async function storePassword(password: string) {
  log(null, logger, 'storing password');
  if (isPasswordSecurelyStorable()) {
    try {
      await clortho.saveToKeychain(ALKS_USERID, password);
    } catch (e) {
      return false;
    }
    return true;
  } else {
    netrc.update(SERVICE, {
      login: ALKS_USERID,
      password,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerReadWriteOnlyPermission());

    return true;
  }
}
