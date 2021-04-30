import { Favorites } from '../model/favorites';
import loki from 'lokijs';
import { getDbFile } from './getDbFile';
import { log } from './log';
import { getCollection } from './getCollection';

const db = new loki(getDbFile());

const logger = 'favorites';

export async function saveFavorites(data: {
  accounts: Favorites;
}): Promise<void> {
  log(null, logger, 'saving favorites');
  const favorites: Collection<Favorites> = await getCollection('favorites');

  favorites.removeDataOnly();

  favorites.insert(data.accounts);

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
