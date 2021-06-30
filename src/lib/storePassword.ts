import c from '@cox-automotive/clortho';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import { log } from './log';
import netrc from 'node-netrc';
import chmod from 'chmod';
import { getFilePathInHome } from './getFilePathInHome';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';

const clortho = c.forService('alkscli');
const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

export async function storePassword(password: string) {
  log('storing password');
  if (isPasswordSecurelyStorable()) {
    await clortho.saveToKeychain(ALKS_USERID, password);
  } else {
    netrc.update(SERVICE, {
      login: ALKS_USERID,
      password,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerReadWriteOnlyPermission());
  }
}
