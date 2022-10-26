export function extractAccountId(account: string): string | undefined {
  let match;
  const accountIdRegex = /^\d{12}$/g; // If the account is just a 12 digit number
  const accountIdPlusRoleRegex = /(^\d{12})(\/)/g; // If the account is 12 digit number followed by slash
  if (accountIdRegex.exec(account)) {
    return account;
  } else {
    match = accountIdPlusRoleRegex.exec(account);
    if (match) {
      return match[1]; // Return the first match group, which is the 12 digit ID
    }
  }
  return undefined;
}
