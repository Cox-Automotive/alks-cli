import { getDeveloper, updateDeveloper } from './developer';
import { log } from '../log';

export async function getOutputFormat() {
  const developer = await getDeveloper();
  if (developer.outputFormat) {
    log('using stored output format');
    return developer.outputFormat;
  }

  throw new Error(
    'ALKS CLI is not configured. Please run: alks developer configure'
  );
}

export async function setOutputFormat(outputFormat: string) {
  await updateDeveloper({ outputFormat });
}
