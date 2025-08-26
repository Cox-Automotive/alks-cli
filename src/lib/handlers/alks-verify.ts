import { errorAndExit } from './errorAndExit';

export interface VerifyOptions {
  changerequest?: string;
}

export async function handleAlksVerify(options: VerifyOptions) {
  if (!options.changerequest) {
    errorAndExit('The -r, --changerequest flag is required for verify mode.');
  }
  // ...actual verify logic here...
  console.log('Verify called with:', options);
}
