import loki from 'lokijs';
import pkg from '../../package.json';
import { getDbFile } from './getDbFile';
import { log } from '../lib/log';
import { trim } from '../lib/trim';
import { Developer, NewDeveloper } from '../model/developer';
import { getCollection } from './getCollection';

const db = new loki(getDbFile());

const logger = 'developer';

export async function saveDeveloper(developer: NewDeveloper): Promise<void> {
  log(null, logger, 'saving developer');
  const collection: Collection<Developer> = await getCollection('account');

  collection.removeDataOnly();

  collection.insert({
    server: developer.server && trim(developer.server),
    userid: developer.userid && trim(developer.userid),
    alksAccount: developer.alksAccount && trim(developer.alksAccount),
    alksRole: developer.alksRole && trim(developer.alksRole),
    lastVersion: pkg.version,
    outputFormat: developer.outputFormat && trim(developer.outputFormat),
  });

  return new Promise((resolve, reject) => {
    db.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
