import c from '@cox-automotive/clortho';
import { isEmpty } from 'underscore';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import netrc from 'node-netrc';

const clortho = c.forService('alkscli');
const SERVICE = 'alkscli';
const ALKS_USERID = 'alksuid';

export async function getPasswordFromKeystore() {
  if (isPasswordSecurelyStorable()) {
    try {
      const data = await clortho.getFromKeychain(ALKS_USERID);
      if (data) {
        return data.password;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else {
    const auth = netrc(SERVICE);
    if (!isEmpty(auth.password)) {
      return auth.password;
    } else {
      return null;
    }
  }
}
