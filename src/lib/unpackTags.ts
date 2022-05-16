import { Tag } from 'alks.js';
/**
 * Parse tags as key-value pairs. Similar to parseKeyValuePairs but with a different interface
 *
 * @param inputs - a string containing key-value pairs in one of two forms consistent with the AWS CLI
 * @see https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-shorthand.html
 *
 * @example
 * parseKeyValuePairs('key1=value1,key2=value2')
 *
 * @example
 * parseKeyValuePairs('{"key1":"value1","key2":"value2"}')
 */

export function unpackTags(inputs: string[]): Tag[] {
  let record: Record<string, string> | undefined = parseShorthand(inputs);
  if (typeof record == 'undefined') {
    let obj = JSON.parse(inputs[0], (_, value) =>
      typeof value !== 'object' ? String(value) : value
    );

    record = {} as Record<string, string>;

    if (!obj.length) {
      obj = [obj];
    }
    for (const entry of obj) {
      record[entry.Key] = entry.Value;
    }
  }

  const tags: Tag[] = [];

  for (const [key, value] of Object.entries(record)) {
    const t: Tag = {
      key,
      value,
    };
    tags.push(t);
  }
  return tags;
}

function parseShorthand(inputs: string[]): Record<string, string> | undefined {
  const record: Record<string, string> = {};
  try {
    JSON.parse(inputs[0]);
    if (inputs.length > 1) {
      throw SyntaxError('JSON option syntax should be a single string');
    }
    return;
  } catch (e) {
    const errorMsg =
      'Improper syntax. Should look like either \'{"Key":"key1", "Value":"val1"}\' or "Key=key1,Value=val1"';
    for (const input of inputs) {
      try {
        const pair = input.split(',');
        const key = pair[0].split('=')[1];
        const value = pair[1].split('=')[1];
        if (!key || !value) {
          throw SyntaxError(errorMsg);
        }
        record[key] = value;
      } catch (e) {
        throw SyntaxError(errorMsg);
      }
    }
  }
  return record;
}
