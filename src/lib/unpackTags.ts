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
    // Should fail fast if a parsing error is encountered
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

  let tags: Tag[] = [];

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
  let record: Record<string, string> = {};
  try {
    JSON.parse(inputs[0]);
    return;
  } catch (e) {
    for (const input of inputs) {
      const pair = input.split(',');
      const key = pair[0].split('=')[1];
      const value = pair[1].split('=')[1];
      record[key] = value;
    }
  }
  return record;
}
