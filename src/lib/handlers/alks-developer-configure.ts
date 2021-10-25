import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { confirm } from '../confirm';
import { errorAndExit } from '../errorAndExit';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { log } from '../log';
import { promptForOutputFormat } from '../promptForOutputFormat';
import { promptForPassword } from '../promptForPassword';
import { promptForServer } from '../promptForServer';
import { promptForUserId } from '../promptForUserId';
import { setServer } from '../state/server';
import { setUserId } from '../state/userId';
import { setAlksAccount } from '../state/alksAccount';
import { setAlksRole } from '../state/alksRole';
import { setOutputFormat } from '../state/outputFormat';
import { promptForToken } from '../promptForToken';
import {
  promptForAuthType,
  REFRESH_TOKEN_AUTH_CHOICE,
  PASSWORD_AUTH_CHOICE,
  ALWAYS_ASK_AUTH_CHOICE,
} from '../promptForAuthType';
import { validateAlksAccount } from '../validateAlksAccount';
import tabtab from 'tabtab';
import { setToken } from '../state/token';
import { setPassword } from '../state/password';
import { CREDENTIAL_PROCESS_AUTH_CHOICE } from '../promptForAuthType';
import { setCredentialProcess } from '../state/credentialProcess';
import { promptForCredentialProcess } from '../promptForCredentialProcess';

export async function handleAlksDeveloperConfigure(
  options: commander.OptionValues
) {
  try {
    if (options.nonInteractive) {
      console.log(
        'Warning: configuring in non-interactive mode may leave the alks cli only partially configured. Running this command in interactive mode may still be needed to fully configure this tool'
      );
    }

    const shouldPrompt = !options.nonInteractive;
    if (options.server || shouldPrompt) {
      await setServer(options.server ?? (await promptForServer()));
    }

    if (options.username || shouldPrompt) {
      await setUserId(options.username ?? (await promptForUserId()));
    }

    // Override authType flag if a credential process was provided
    let authTypeFlag = options.authType;
    if (options.credentialProcess) {
      authTypeFlag = CREDENTIAL_PROCESS_AUTH_CHOICE;
    }

    if (authTypeFlag || shouldPrompt) {
      const authType = authTypeFlag ?? (await promptForAuthType());

      switch (authType) {
        case REFRESH_TOKEN_AUTH_CHOICE: {
          await setToken(await promptForToken());
          break;
        }
        case PASSWORD_AUTH_CHOICE: {
          const password = await promptForPassword();
          const savePasswordAnswer = await confirm('Save password');
          if (savePasswordAnswer) {
            await setPassword(password);
          }
          break;
        }
        case CREDENTIAL_PROCESS_AUTH_CHOICE: {
          await setCredentialProcess(
            options.credentialProcess ?? (await promptForCredentialProcess())
          );
          break;
        }
        case ALWAYS_ASK_AUTH_CHOICE: {
          // do nothing
          break;
        }
        default: {
          throw new Error('Invalid auth type selected');
        }
      }
    }

    if (options.account && options.role) {
      await validateAlksAccount(options.account, options.role);
      await setAlksAccount(options.account);
      await setAlksRole(options.role);
    } else if (shouldPrompt) {
      log('Getting ALKS accounts');
      const { alksAccount, alksRole } = await promptForAlksAccountAndRole({
        prompt: 'Please select your default ALKS account/role',
      });
      await setAlksAccount(alksAccount);
      await setAlksRole(alksRole);
    }

    if (options.output || shouldPrompt) {
      log('Getting output formats');
      setOutputFormat(options.output ?? (await promptForOutputFormat()));
    }

    console.error(clc.white('Your developer configuration has been updated.'));

    if (process.stdin.isTTY && shouldPrompt) {
      await tabtab.install({
        name: 'alks',
        completer: 'alks',
      });
    }

    await checkForUpdate();
  } catch (err) {
    errorAndExit(
      'Error configuring developer: ' + (err as Error).message,
      err as Error
    );
  }
}
