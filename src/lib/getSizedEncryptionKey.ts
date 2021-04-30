import lp from 'left-pad';

const ENC_LEN = 32;

export function getSizedEncryptionKey(key: string) {
  // must be 256 bytes (32 characters)
  return lp(key, ENC_LEN, 0).substring(0, ENC_LEN);
}
