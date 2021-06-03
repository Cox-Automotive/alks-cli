import { Metadata } from '../model/metadata';
import { getCollection } from './getCollection';
import { log } from './log';
import { getDb } from './db';

export async function saveMetadata(data: Metadata): Promise<void> {
  log('saving metadata');
  const md: Collection<Metadata> = await getCollection('metadata');
  md.removeDataOnly();

  md.insert(data);

  return new Promise((resolve, reject) => {
    getDb().save((err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
