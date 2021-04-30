import { isOsx } from './isOsx';
import { isWindows } from './isWindows';

export function isPasswordSecurelyStorable() {
  return isOsx() || isWindows();
}
