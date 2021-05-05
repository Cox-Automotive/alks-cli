import { log } from './log';
import ua from 'universal-analytics';
import { getDeveloper } from './getDeveloper';
import { getCallerInfo } from './getCallerInfo';

let visitor: ua.Visitor | null = null;
const GA_ID = 'UA-88747959-1';

export async function trackActivity() {
  const caller = getCallerInfo();
  const logger = `${caller.fileName}:${caller.line}:${caller.char}`;
  if (!visitor) {
    const dev = await getDeveloper();
    log('creating tracker for: ' + dev.userid);
    visitor = ua(GA_ID, String(dev.userid), {
      https: true,
      strictCidFormat: false,
    });
  }
  log('tracking activity: ' + logger);
  visitor.event('activity', logger).send();
}
