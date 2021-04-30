const accountRegex = /([0-9]*)(\/)(ALKS)([a-zA-Z]*)([- ]*)([a-zA-Z0-9_-]*)/g;

export function getAccountRegex() {
  return accountRegex;
}
