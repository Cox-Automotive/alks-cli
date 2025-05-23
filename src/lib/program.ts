import { Command } from 'commander';
import { version } from '../../package.json';
import {
  getOutputValues,
  getOutputValuesAccounts,
  getOutputValuesRoleTypes,
} from '../lib/getOutputValues';
import { handleAlksSessionsOpen } from '../lib/handlers/alks-sessions-open';
import { handleAlksDeveloperConfigure } from '../lib/handlers/alks-developer-configure';
import { handleAlksSessionsList } from '../lib/handlers/alks-sessions-list';
import { handleAlksSessionsConsole } from '../lib/handlers/alks-sessions-console';
import { handleAlksServerStop } from '../lib/handlers/alks-server-stop';
import { handleAlksServerStart } from '../lib/handlers/alks-server-start';
import { handleAlksServerConfigure } from '../lib/handlers/alks-server-configure';
import { handleAlksIamRoleTypes } from '../lib/handlers/alks-iam-roletypes';
import { handleAlksIamDeleteRole } from '../lib/handlers/alks-iam-deleterole';
import { handleAlksIamDeleteLtk } from '../lib/handlers/alks-iam-deleteltk';
import { handleAlksIamCreateTrustRole } from '../lib/handlers/alks-iam-createtrustrole';
import { handleAlksIamCreateRole } from '../lib/handlers/alks-iam-createrole';
import { handleAlksIamCreateLtk } from '../lib/handlers/alks-iam-createltk';
import { handleAlksIamUpdateIamUser } from './handlers/alks-iam-updateiamuser';
import { handleAlksDeveloperAccounts } from '../lib/handlers/alks-developer-accounts';
import { handleAlksDeveloperFavorites } from '../lib/handlers/alks-developer-favorites';
import { handleAlksDeveloperInfo } from '../lib/handlers/alks-developer-info';
import { handleAlksDeveloperLogin } from '../lib/handlers/alks-developer-login';
import { handleAlksDeveloperLogin2fa } from '../lib/handlers/alks-developer-login2fa';
import { handleAlksDeveloperLogout } from '../lib/handlers/alks-developer-logout';
import { handleAlksDeveloperLogout2fa } from '../lib/handlers/alks-developer-logout2fa';
import { handleCompletion } from './handlers/alks-completion';
import { red } from 'cli-color';
import { handleAlksIamUpdateRole } from './handlers/alks-iam-updaterole';
import { handleAlksProfilesGenerate } from './handlers/alks-profiles-generate';
import { handleAlksProfilesList } from './handlers/alks-profiles-list';
import { handleAlksProfilesRemove } from './handlers/alks-profiles-remove';
import { handleAlksProfilesGet } from './handlers/alks-profiles-get';

const outputValues = getOutputValues();
const nameDesc = 'alphanumeric including @+=._-';
const trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';

const program = new Command();

program.exitOverride();

program.configureOutput({
  writeErr: (str) => {
    if (!str.startsWith('error: unknown command')) {
      process.stderr.write(str);
    }
  },
});

program
  .version(version, '--version')
  .option('-v, --verbose', "be verbose, but don't print secrets")
  .option(
    '-V, --unsafe-verbose',
    'be verbose, including secrets (be careful where you share this output)'
  )
  .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().unsafeVerbose) {
      console.error(
        red(
          'Warning: Unsafe loggin mode is activated which means that secrets may be printed in the output below. Do not share the output of this CLI with anyone while this mode is active'
        )
      );
    }
  });

program
  .command('completion')
  .description('shell completer for cli commands')
  .action(handleCompletion);

const sessions = program
  .command('sessions')
  .alias('session')
  .description('manage aws sessions');

sessions
  .command('open')
  .description('creates or resumes a session')
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option(
    '-i, --iam',
    'create an IAM session. This flag is deprecated since it is no longer needed and will not make a difference in the generated session credentials'
  )
  .option(
    '-d, --default',
    'uses your default account from "alks developer configure"'
  )
  .option(
    '-D, --duration <duration>',
    'the duration of the session in hours. If the duration is over the max duration allowed for the role, the max duration will be used instead',
    '12'
  )
  .option('-N, --newSession', 'forces a new session to be generated')
  .option('-p, --password <password>', 'my password')
  .option(
    '-o, --output <format>',
    'output format (' + outputValues.join(', ') + ')'
  )
  .option(
    '-n, --namedProfile <profile>',
    'alias for --profile, if output is set to creds, use this profile, default: default'
  )
  .option(
    '-P, --profile <profile>',
    'if output is set to creds, use this profile, default: default'
  )
  .option(
    '-f, --force',
    'if output is set to creds, force overwriting of AWS credentials'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .action(handleAlksSessionsOpen);

sessions
  .command('list')
  .alias('ls')
  .description('list active sessions')
  .option('-p, --password <password>', 'my password')
  .action(handleAlksSessionsList);

sessions
  .command('console')
  .description('open an AWS console in your browser')
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-i, --iam', 'create an IAM session')
  .option(
    '-d, --default',
    'uses your default account from "alks developer configure"'
  )
  .option('-N, --newSession', 'forces a new session to be generated')
  .option('-u, --url', 'just print the url')
  .option('-o, --openWith <openWith>', 'open in a different app (optional)')
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-p, --password <password>', 'my password')
  .action(handleAlksSessionsConsole);

const iam = program.command('iam').description('manage iam resources');

iam
  .command('roletypes')
  .alias('role-types')
  .alias('list-role-types')
  .description(
    'list the available iam role types. We recommend specifying the trust policy when creating roles instead since role types are a legacy feature and no new role types are being created for new AWS services'
  )
  .option(
    '-o, --output <format>',
    'output format (' + getOutputValuesRoleTypes().join(', ') + ')',
    getOutputValuesRoleTypes()[0]
  )
  .action(handleAlksIamRoleTypes);

iam
  .command('deleterole')
  .alias('delete-role')
  .description('remove an IAM role')
  .option('-n, --rolename <rolename>', 'the name of the role to delete')
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .action(handleAlksIamDeleteRole);

iam
  .command('deleteltk')
  .alias('delete-ltk')
  .description('deletes an IAM long term key/IAM User')
  .option(
    '-n, --iamusername <iamUsername>',
    'the name of the iam user associated with the LTK'
  )
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .action(handleAlksIamDeleteLtk);

iam
  .command('createtrustrole')
  .alias('create-trust-role')
  .description(
    '(Deprecated - use `alks iam create-role` instead) creates a new IAM Trust role'
  )
  .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
  .option(
    '-t, --roletype <roletype>',
    'the role type: Cross Account or Inner Account'
  )
  .option('-T, --trustarn <trustarn>', 'trust arn, ' + trustArnDesc)
  .option(
    '-e, --enableAlksAccess',
    'enable alks access (MI), default: false',
    false
  )
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .option(
    '-k, --tags <tags...>',
    `A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string`
  )
  .action(handleAlksIamCreateTrustRole);

iam
  .command('createrole')
  .alias('create-role')
  .description('creates a new IAM role')
  .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
  .option(
    '-t, --roletype <roletype>',
    'the role type, to see available roles: alks iam roletypes. Must provide role type or trust policy. We recommend specifying the trust policy instead since role types are a legacy feature and no new role types are being created for new AWS services'
  )
  .option(
    '-p,  --trustPolicy <trustPolicy>',
    'the trust policy as JSON string, must provide trust policy or role type'
  )
  .option(
    '-d, --defaultPolicies',
    'include default policies, default: false',
    false
  )
  .option(
    '-e, --enableAlksAccess',
    'enable alks access (MI), default: false',
    false
  )
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .option(
    '-k, --tags <tags...>',
    `A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string`
  )
  .option(
    '-T, --template-fields <templateFields...>',
    `key-value pairs used to populate template fields in the trust policy document of the role. Can either be a JSON string like '{"key1":"value1","key2":"value2"}' or a list of pairs like key1=value1,key2=value2`
  )
  .action(handleAlksIamCreateRole);

iam
  .command('createltk')
  .alias('create-ltk')
  .description('creates a new IAM long term key/IAM User')
  .option(
    '-n, --iamusername <iamUsername>',
    'the name of the iam user associated with the LTK, ' + nameDesc
  )
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .option('-o, --output <format>', 'output format (text, json)', 'text')
  .option(
    '-k, --tags <tags...>',
    `A list of resource tags. Can either be a JSON representation ['{"Key":"key1", "Value":"val1"}', '{"Key":"key2", "Value":"val2"}'] or shorthand Key=string,Value=string Key=string,Value=string`
  )
  .action(handleAlksIamCreateLtk);

iam
  .command('updaterole')
  .alias('update-role')
  .description('updates an existing IAM role')
  .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
  .option('-p,  --trustPolicy <trustPolicy>', 'the trust policy as JSON string')
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-F, --favorites', 'filters favorite accounts')
  .option(
    '-k, --tags <tags...>',
    `A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string`
  )
  .action(handleAlksIamUpdateRole);

iam
  .command('updateIamUser')
  .alias('updateltk')
  .alias('update-ltk')
  .description('Updates the tags on an IAM long term key/IAM User')
  .option(
    '-n, --iamusername <iamUsername>',
    'the name of the iam user to update, ' + nameDesc
  )
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option('-o, --output <format>', 'output format (text, json)', 'text')
  .option(
    '-k, --tags <tags...>',
    `A list of resource tags. Can either be a JSON representation ['{"Key":"key1", "Value":"val1"}', '{"Key":"key2", "Value":"val2"}'] or shorthand Key=string,Value=string Key=string,Value=string`
  )
  .action(handleAlksIamUpdateIamUser);

const developer = program
  .command('developer')
  .description('developer & account commands');

developer
  .command('configure')
  .description('configures developer')
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account to use as a default account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use as the default role for carrying out requests'
  )
  .option('-o, --output <format>', 'output format')
  .option(
    '-u, --username <username>',
    'your network username. NOTE: this is not your email prefix'
  )
  .option('-s, --server <server>', 'alks server')
  .option(
    '-A, --auth-type <authType>',
    'automatically selects the auth type provided'
  )
  .option(
    '--credential-process <scriptPath>',
    'the path to your credential_process script. Automatically sets the auth-type to credential-process'
  )
  .option(
    '--non-interactive',
    'do not prompt for anything. When this flag is passes, only fields passed via command-line arguments will be set'
  )
  .action(handleAlksDeveloperConfigure);

developer
  .command('accounts')
  .description('shows current developer configuration')
  .option('-e, --export', 'export accounts to environment variables')
  .option(
    '-o, --output <format>',
    'output format (' + getOutputValuesAccounts().join(', ') + ')',
    getOutputValuesAccounts()[0]
  )
  .action(handleAlksDeveloperAccounts);

developer
  .command('favorites')
  .description('configure which accounts are favorites')
  .action(handleAlksDeveloperFavorites);

developer
  .command('info')
  .description('shows current developer configuration')
  .action(handleAlksDeveloperInfo);

developer
  .command('login')
  .description('stores password')
  .option('-u, --username <username>', 'your username')
  .action(handleAlksDeveloperLogin);

developer
  .command('login2fa')
  .description('stores your alks refresh token')
  .action(handleAlksDeveloperLogin2fa);

developer
  .command('logout')
  .description('removes password')
  .action(handleAlksDeveloperLogout);

developer
  .command('logout2fa')
  .description('removes alks refresh token')
  .action(handleAlksDeveloperLogout2fa);

const server = program
  .command('server')
  .name('server')
  .description('ec23 metadata server');

server
  .command('stop')
  .description('stops the metadata server')
  .action(handleAlksServerStop);

server
  .command('start')
  .description('starts the metadata server')
  .action(handleAlksServerStart);

server
  .command('configure')
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account'
  )
  .option(
    '-r, --role <authRole>',
    'the ALKS IAM role to use to perform the request'
  )
  .option('-i, --iam', 'create an IAM session')
  .option('-p, --password <password>', 'my password')
  .option('-F, --favorites', 'filters favorite accounts')
  .action(handleAlksServerConfigure);

const profiles = program
  .command('profiles')
  .alias('profile')
  .name('profiles')
  .description('manage aws profiles');

profiles
  .command('generate')
  .alias('add')
  .alias('create')
  .description('generate aws profiles')
  .option(
    '-A, --all',
    'generate profiles for all accounts/roles that you have access to'
  )
  .option(
    '-a, --account <accountIdOrAlias>',
    'the 12-digit ID or alias for an AWS account to use for the profile'
  )
  .option('-r, --role <authRole>', 'the ALKS IAM role to use for the profile')
  .option(
    '-n, --namedProfile <profile>',
    'alias for --profile, the name of the profile to generate. If not specified the "default" profile will be updated'
  )
  .option(
    '-P, --profile <profile>',
    'the name of the profile to generate. If not specified the "default" profile will be updated'
  )
  .option(
    '-f, --force',
    'if output is set to creds, force overwriting of AWS credentials'
  )
  .action(handleAlksProfilesGenerate);

profiles
  .command('list')
  .alias('ls')
  .description('list aws profiles')
  .option(
    '-A, --all',
    'list all profiles including those not managed by alks',
    false
  )
  .option('-o, --output <format>', 'output format (list, json)', 'list')
  .option(
    '-S, --show-sensitive-values',
    'show sensitive values in the output as opposed to replacing them with asterisks',
    false
  )
  .action(handleAlksProfilesList);

profiles
  .command('remove')
  .alias('rm')
  .alias('delete')
  .description('delete aws profiles')
  .option(
    '-A, --all',
    'delete profiles for all accounts/roles that you have access to that are managed by alks'
  )
  .option(
    '-n, --namedProfile <profile>',
    'alias for --profile, the name of the profile to generate. If not specified the "default" profile will be updated'
  )
  .option(
    '-P, --profile <profile>',
    'the name of the profile to generate. If not specified the "default" profile will be updated'
  )
  .option(
    '-f, --force',
    'skip the confirmation prompt and delete the profile(s)'
  )
  .action(handleAlksProfilesRemove);

profiles
  .command('get')
  .description('get aws profile')
  .option(
    '-n, --namedProfile <profile>',
    'alias for --profile, the name of the profile to generate. If not specified the "default" profile will be updated'
  )
  .option(
    '-P, --profile <profile>',
    'the name of the profile to generate. If not specified the "default" profile will be updated'
  )
  .option('-o, --output <format>', 'output format (text, json)', 'text')
  .option(
    '-S, --show-sensitive-values',
    'show sensitive values in the output as opposed to replacing them with asterisks',
    false
  )
  .action(handleAlksProfilesGet);

export default program;
