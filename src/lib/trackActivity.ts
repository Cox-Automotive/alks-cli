import { log } from './log';
import ua from 'universal-analytics';
import { getDeveloper } from './getDeveloper';

let visitor: ua.Visitor | null = null;
const GA_ID = 'UA-88747959-1';

export async function trackActivity(logger: string) {
  if (!visitor) {
    const dev = await getDeveloper();
    log(null, logger, 'creating tracker for: ' + dev.userid);
    visitor = ua(GA_ID, String(dev.userid), {
      https: true,
      strictCidFormat: false,
    });
  }
  log(null, logger, 'tracking activity: ' + logger);
  visitor.event('activity', logger).send();
}
