import { getDbFile } from './getDbFile';
import Loki from 'lokijs';

const db = new Loki(getDbFile());

export function getDb() {
  return db;
}
