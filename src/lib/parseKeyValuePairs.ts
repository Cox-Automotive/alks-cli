/**
 * Parses key-value pairs into an object whose keys are the keys and whose values are the values
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
export function parseKeyValuePairs(inputs: string[]): Record<string, string> {
  const options: Record<string, string> = {};

  for (const input of inputs) {
    try {
      // First attempt a JSON parse
      const record = JSON.parse(input);

      // Force all values to be strings (by definition, all keys already have to be strings so we don't need to check that)
      for (const [key, value] of Object.entries(record)) {
        if (typeof value !== 'string') {
          options[key] = String(value);
        } else {
          options[key] = value;
        }
      }
    } catch (e) {
      // Otherwise parse as comma-separated key=value pairs
      const pairs = input.split(',');
      const record = pairs.reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      for (const [key, value] of Object.entries(record)) {
        options[key] = value;
      }
    }
  }

  return options;
}
