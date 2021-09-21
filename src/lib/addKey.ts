import { Auth } from '../model/auth';
import { encrypt } from './encrypt';
import { getKeysCollection } from './getKeysCollection';
import { isTokenAuth } from './isTokenAuth';
import { getDb } from './db';

export async function addKey(
  accessKey: string,
  secretKey: string,
  sessionToken: string,
  alksAccount: string,
  alksRole: string,
  expires: Date,
  auth: Auth,
  isIAM: boolean
): Promise<void> {
  const enc = isTokenAuth(auth) ? auth.token : auth.password;

  const keys = await getKeysCollection();

  keys.insert({
    accessKey: encrypt(accessKey, enc),
    secretKey: encrypt(secretKey, enc),
    sessionToken: encrypt(sessionToken, enc),
    alksAccount: encrypt(alksAccount, enc),
    alksRole: encrypt(alksRole, enc),
    isIAM,
    expires,
  });

  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.save((err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
