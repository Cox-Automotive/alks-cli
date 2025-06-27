import { Account } from 'alks.js';

// An ALKS account object with additional properties for easier access
export interface ParsedAccount extends Account {
  accountId: string;
  accountAlias: string;
  accountIdAndRole: string;
}
