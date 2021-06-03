import { Favorites } from '../model/favorites';
import { getCollection } from './getCollection';
import { log } from './log';

export async function getFavorites(): Promise<string[]> {
  log('retreiving favorites');
  const favorites: Collection<Favorites> = await getCollection('favorites');
  const data = favorites.chain().data()[0];
  if (data && data.favorites) {
    return data.favorites;
  } else {
    return [];
  }
}
