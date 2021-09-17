import { log } from './log';
import ua from 'universal-analytics';
import { getCallerInfo } from './getCallerInfo';
import { getUserId } from './state/userId';

let visitor: ua.Visitor | null = null;
const GA_ID = 'UA-88747959-1';

export async function trackActivity() {
  const caller = getCallerInfo();
  const logger = `${caller.fileName}:${caller.line}:${caller.char}`;
  if (!visitor) {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No userid was configured');
    }
    log('creating tracker for: ' + userId);
    visitor = ua(GA_ID, String(userId), {
      https: true,
      strictCidFormat: false,
    });
  }
  log('tracking activity: ' + logger);
  visitor.event('activity', logger).send();
}
