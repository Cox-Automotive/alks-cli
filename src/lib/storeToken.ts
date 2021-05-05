import c from 'clortho';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import { log } from './log';
import netrc from 'node-netrc';
import chmod from 'chmod';
import { getFilePathInHome } from './getFilePathInHome';
import { getOwnerReadWriteOnlyPermission } from './getOwnerReadWriteOwnerPermission';

const clortho = c.forService('alkscli');
const SERVICETKN = 'alksclitoken';
const ALKS_TOKEN = 'alkstoken';

export async function storeToken(token: string) {
  log('storing token');
  if (isPasswordSecurelyStorable()) {
    await clortho.saveToKeychain(ALKS_TOKEN, token);
  } else {
    netrc.update(SERVICETKN, {
      password: token,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerReadWriteOnlyPermission());
  }
}
