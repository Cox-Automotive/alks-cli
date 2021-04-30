import { isEmpty, times } from 'underscore';

export function obfuscate(str: string) {
  if (isEmpty(str)) {
    return '';
  }

  const s1 = Math.floor(str.length * 0.3);
  const obfuscated = [str.substring(0, s1)];

  times(str.length - s1, () => {
    obfuscated.push('*');
  });

  return obfuscated.join('');
}
