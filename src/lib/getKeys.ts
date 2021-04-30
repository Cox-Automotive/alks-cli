import { getDbFile } from './getDbFile';
import loki from 'lokijs';
import { Auth } from '../model/auth';
import { Key } from '../model/keys';
import moment from 'moment';
import { isTokenAuth } from './isTokenAuth';
import { each } from 'underscore';
import { decrypt } from './decrypt';
import { getKeysCollection } from './getKeysCollection';

const db = new loki(getDbFile());

export async function getKeys(
  auth: Auth,
  isIAM: boolean
): Promise<(Key & LokiObj)[]> {
  const keys = await getKeysCollection();
  const now = moment();
  const enc = isTokenAuth(auth) ? auth.token : auth.password;

  // first delete any expired keys
  keys.removeWhere({ expires: { $lte: now.toDate() } });

  return new Promise((resolve, reject) => {
    // save the db to prune expired keys, wait for transaction to complete
    db.save((err) => {
      if (err) {
        reject(err);
        return;
      }

      // now get valid keys, decrypt their values and return
      const data = keys
        .chain()
        .find({ isIAM: { $eq: isIAM } })
        .simplesort('expires')
        .data();

      const dataOut: (Key & LokiObj)[] = [];
      each(data, (keydata) => {
        // try catch here since we upgraded encryption and previously encrypted sessions will fail to decrypt
        try {
          keydata.accessKey = decrypt(keydata.accessKey, enc);
          keydata.secretKey = decrypt(keydata.secretKey, enc);
          keydata.sessionToken = decrypt(keydata.sessionToken, enc);
          keydata.alksAccount = decrypt(keydata.alksAccount, enc);
          keydata.alksRole = decrypt(keydata.alksRole, enc);
          keydata.isIAM = isIAM;
          dataOut.push(keydata);
        } catch (e) {
          // console.warn('Error decrypting session data.', e.message);
        }
      });

      resolve(dataOut);
    });
  });
}
