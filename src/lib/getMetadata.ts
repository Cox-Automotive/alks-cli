import { Metadata } from '../model/metadata';
import { getCollection } from './getCollection';
import { log } from './log';

const logger = 'metadata';

export async function getMetadata(): Promise<Metadata> {
  log(null, logger, 'retreiving metadata');
  const md: Collection<Metadata> = await getCollection('metadata');
  const data = md.chain().data()[0];
  return data || [];
}
