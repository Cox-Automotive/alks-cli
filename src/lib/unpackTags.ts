import { Tag } from 'alks.js';
/**
 * Parse tags into a Tags object from either JSON or the AWS defined shorthand for tag options
 *
 * @param inputs - a list of strings containing key-value pairs in one of two forms consistent with the AWS CLI
 * @see https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-shorthand.html
 *
 * @example
 * parseKeyValuePairs(['Key=key1,Value=val1'])
 *
 * @example
 * parseKeyValuePairs(['{"Key":"key1","Value":"value1"}'])
 */

export function unpackTags(inputs: string[]): Tag[] {
  const tags: Tag[] = [];

  for (const input of inputs) {
    let record: Record<string, string> | undefined = parseShorthand(input);
    if (typeof record == 'undefined') {
      let obj = JSON.parse(input, (_, value) =>
        typeof value !== 'object' ? String(value) : value
      );
      // iterable object must be a list otherwise the length returns undefined
      obj = obj.length ? obj : [obj];

      record = {} as Record<string, string>;
      for (const entry of obj) {
        record[entry.Key] = entry.Value;
      }
    }
    for (const [key, value] of Object.entries(record)) {
      const t: Tag = {
        key,
        value,
      };
      tags.push(t);
    }
  }
  return tags;
}

function parseShorthand(input: string): Record<string, string> | undefined {
  const record: Record<string, string> = {};
  try {
    JSON.parse(input);
    return;
  } catch (e) {
    const errorMsg =
      'Improper tag syntax. Should look like either \'{"Key":"key1", "Value":"val1"}\' or "Key=key1,Value=val1"';
    try {
      const pair = input.split(',');
      const key = pair[0].split('=');
      const value = pair[1].split('=');
      if (!(key[0] === 'Key' && value[0] === 'Value')) {
        throw SyntaxError(errorMsg);
      }
      record[key[1]] = value[1];
    } catch (e) {
      throw SyntaxError(errorMsg);
    }
  }
  return record;
}
