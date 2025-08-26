import { errorAndExit } from './errorAndExit';

export interface CreateOptions {
  ciid?: string;
  description?: string;
  activitytype?: string;
}

export async function handleAlksCreate(options: CreateOptions) {
  if (!options.ciid || !options.description || !options.activitytype) {
    errorAndExit(
      'All of -c, --ciid, --description, and --activitytype are required for create mode.'
    );
  }
  // ...actual create logic here...
  console.log('Create called with:', options);
}
