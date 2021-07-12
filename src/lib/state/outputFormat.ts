import { getDeveloper, updateDeveloper } from './developer';
import { log } from '../log';

export async function getOutputFormat(): Promise<string> {
  const developer = await getDeveloper();
  if (developer.outputFormat) {
    log('using stored output format');
    return developer.outputFormat;
  }

  throw new Error(
    'Output format is not specified. Please run: alks developer configure'
  );
}

export async function setOutputFormat(outputFormat: string) {
  await updateDeveloper({ outputFormat });
}
