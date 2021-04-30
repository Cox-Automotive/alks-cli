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

const logger = 'token';

export async function storeToken(token: string) {
  log(null, logger, 'storing token');
  if (isPasswordSecurelyStorable()) {
    await clortho.saveToKeychain(ALKS_TOKEN, token);
  } else {
    netrc.update(SERVICETKN, {
      password: token,
    });

    chmod(getFilePathInHome('.netrc'), getOwnerReadWriteOnlyPermission());
  }
}
