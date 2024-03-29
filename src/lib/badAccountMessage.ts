export const badAccountMessage = `
Incorrect account or role. Consider checking the following:
- Your account should be either an account ID, account alias, or a string starting with an account ID like "012345678910/ALKSPowerUser - awsfoonp" or "012345678910".
- If you specify an account in the form "012345678910/ALKSPowerUser - awsfoonp", the role will be inferred, unless the -r/--role flag is passed.
- When using the -r/--role flag, the role should look like "PowerUser" (without the "ALKS" prefix).
- If either of these fields contain special characters such as spaces, be sure to wrap them in quotes.
- If you don't have access to at least one role in the account, this tool won't be able to recognize the account.
`.trim();
