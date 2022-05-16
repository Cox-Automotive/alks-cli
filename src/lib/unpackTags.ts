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

export function unpackTags(
  inputs: string[]
): Record<string, string | string[]> {
  // var record: Record<string, string | string[]> = {};

  // First, attempt a JSON parse
  // Should fail fast if a parsing error is encountered
  if (inputs.length === 1) {
    var record = JSON.parse(inputs[0], (_, value) =>
      typeof value !== 'object' ? String(value) : value
    );
  }
  console.log(record);
  // } else {
  //   for (const input of inputs) {

  //     // Otherwise parse as comma-separated key=value pairs
  //     const pairs = input.split(',');
  //     const record = pairs.reduce((acc, pair) => {
  //       const [key, value] = pair.split('=');
  //       if (key && value) {
  //         acc[key] = value;
  //       }
  //       return acc;
  //     }, {} as Record<string, string>);

  //     for (const [key, value] of Object.entries(record)) {
  //       options[key] = value;
  //     }
  //   }
  // }
  return record;
}
