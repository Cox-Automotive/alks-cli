import c from '@cox-automotive/clortho';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import netrc from 'node-netrc';
import { isEmpty } from 'underscore';

const clortho = c.forService('alkscli');
const SERVICETKN = 'alksclitoken';
const ALKS_TOKEN = 'alkstoken';

export async function getTokenFromKeystore() {
  if (isPasswordSecurelyStorable()) {
    try {
      const data = await clortho.getFromKeychain(ALKS_TOKEN);
      if (data) {
        return data.password;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else {
    const auth = netrc(SERVICETKN);
    if (!isEmpty(auth.password)) {
      return auth.password;
    } else {
      return null;
    }
  }
}
