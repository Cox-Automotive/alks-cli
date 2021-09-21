import { getDbFile } from './getDbFile';
import Loki from 'lokijs';

let db: Loki;

export async function getDb(): Promise<Loki> {
  if (!db) {
    db = new Loki(await getDbFile());
  }
  return db;
}
