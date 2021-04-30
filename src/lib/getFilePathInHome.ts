import { join } from 'path';

export function getFilePathInHome(filename: string) {
  return join(
    process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH || '',
    filename
  );
}
