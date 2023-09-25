export function sensitive(
  input: string | undefined,
  showCharacters: number = 4
) {
  if (input === undefined) {
    return undefined;
  }
  return input.substring(0, showCharacters) + '******';
}
