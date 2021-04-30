import { createDecipheriv } from 'crypto';
import { isEmpty } from 'underscore';
import { getSizedEncryptionKey } from './getSizedEncryptionKey';

const ENCODING = 'hex';
const ALGORITHM = 'aes-256-cbc';
const PART_CHAR = ':';

export function decrypt(text: string, key: string) {
  if (isEmpty(text)) {
    return '';
  }

  const parts = text.split(PART_CHAR);
  // Warning: if parts is empty, parts.shift() returns undefined and breaks Buffer.from(...)
  const iv = Buffer.from(parts.shift() as string, ENCODING);
  const encd = Buffer.from(parts.join(PART_CHAR), ENCODING);
  const decipher = createDecipheriv(
    ALGORITHM,
    Buffer.from(getSizedEncryptionKey(key)),
    iv
  );
  const decrypt = Buffer.concat([decipher.update(encd), decipher.final()]);

  return decrypt.toString();
}
