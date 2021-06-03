import { Favorites } from '../model/favorites';
import { log } from './log';
import { getCollection } from './getCollection';
import { getDb } from './db';

export async function saveFavorites(data: {
  accounts: Favorites;
}): Promise<void> {
  log('saving favorites');
  const favorites: Collection<Favorites> = await getCollection('favorites');

  favorites.removeDataOnly();

  favorites.insert(data.accounts);

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
