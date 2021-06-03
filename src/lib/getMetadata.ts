import { Metadata } from '../model/metadata';
import { getCollection } from './getCollection';
import { log } from './log';

export async function getMetadata(): Promise<Metadata> {
  log('retreiving metadata');
  const md: Collection<Metadata> = await getCollection('metadata');
  const data = md.chain().data()[0];
  return data || [];
}
