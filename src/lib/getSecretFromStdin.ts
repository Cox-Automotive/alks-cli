let input = '';

export async function getSecretFromStdin(): Promise<string | undefined> {
  if (!process.stdin.isTTY) {
    return undefined;
  }

  // use already-read input on consecutive calls
  if (input.length > 0) {
    return input;
  }

  return new Promise((resolve) => {
    process.stdin.on('data', (data) => {
      input += data;
    });
    process.stdin.on('end', () => {
      resolve(input.trim());
    });
  });
}
