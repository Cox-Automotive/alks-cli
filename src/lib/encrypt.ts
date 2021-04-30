import { createCipheriv, randomBytes } from 'crypto';
import { isEmpty } from 'underscore';
import { getSizedEncryptionKey } from './getSizedEncryptionKey';

const IV_LEN = 16;
const ENCODING = 'hex';
const ALGORITHM = 'aes-256-cbc';
const PART_CHAR = ':';

export function encrypt(text: string, key: string) {
  if (isEmpty(text)) {
    text = '';
  }

  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(
    ALGORITHM,
    Buffer.from(getSizedEncryptionKey(key)),
    iv
  );
  const encd = Buffer.concat([cipher.update(text), cipher.final()]);

  return [iv.toString(ENCODING), encd.toString(ENCODING)].join(PART_CHAR);
}
