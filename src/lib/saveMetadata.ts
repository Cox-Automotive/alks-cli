import { getDbFile } from './getDbFile';
import loki from 'lokijs';
import { Metadata } from '../model/metadata';
import { getCollection } from './getCollection';
import { log } from './log';

const db = new loki(getDbFile());

export async function saveMetadata(data: Metadata): Promise<void> {
  log('saving metadata');
  const md: Collection<Metadata> = await getCollection('metadata');
  md.removeDataOnly();

  md.insert(data);

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
