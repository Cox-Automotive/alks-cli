import { getPrompt } from './getPrompt';
import { getUserId } from './state/userId';

export async function promptForUserId(): Promise<string> {
  // Ignore failure since we're about to prompt for it
  const userId = await getUserId();

  return getPrompt(
    'userid',
    userId,
    'Active Directory Username (this is not part of your email)',
    null
  );
}

// userid.ts change getUserID prompt
// getAuth(): get auth could have returned auth or null. Then whatever calls this would handle the null response.
// Looks at alks developer configure.ts and move the get username field.
