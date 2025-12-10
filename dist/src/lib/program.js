"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const package_json_1 = require("../../package.json");
const getOutputValues_1 = require("../lib/getOutputValues");
const alks_sessions_open_1 = require("../lib/handlers/alks-sessions-open");
const alks_developer_configure_1 = require("../lib/handlers/alks-developer-configure");
const alks_sessions_list_1 = require("../lib/handlers/alks-sessions-list");
const alks_sessions_console_1 = require("../lib/handlers/alks-sessions-console");
const alks_server_stop_1 = require("../lib/handlers/alks-server-stop");
const alks_server_start_1 = require("../lib/handlers/alks-server-start");
const alks_server_configure_1 = require("../lib/handlers/alks-server-configure");
const alks_iam_roletypes_1 = require("../lib/handlers/alks-iam-roletypes");
const alks_iam_deleterole_1 = require("../lib/handlers/alks-iam-deleterole");
const alks_iam_deleteltk_1 = require("../lib/handlers/alks-iam-deleteltk");
const alks_iam_createtrustrole_1 = require("../lib/handlers/alks-iam-createtrustrole");
const alks_iam_createrole_1 = require("../lib/handlers/alks-iam-createrole");
const alks_iam_createltk_1 = require("../lib/handlers/alks-iam-createltk");
const alks_iam_updateiamuser_1 = require("./handlers/alks-iam-updateiamuser");
const alks_developer_accounts_1 = require("../lib/handlers/alks-developer-accounts");
const alks_developer_favorites_1 = require("../lib/handlers/alks-developer-favorites");
const alks_developer_info_1 = require("../lib/handlers/alks-developer-info");
const alks_developer_login_1 = require("../lib/handlers/alks-developer-login");
const alks_developer_login2fa_1 = require("../lib/handlers/alks-developer-login2fa");
const alks_developer_logout_1 = require("../lib/handlers/alks-developer-logout");
const alks_developer_logout2fa_1 = require("../lib/handlers/alks-developer-logout2fa");
const alks_completion_1 = require("./handlers/alks-completion");
const cli_color_1 = require("cli-color");
const alks_iam_updaterole_1 = require("./handlers/alks-iam-updaterole");
const alks_profiles_generate_1 = require("./handlers/alks-profiles-generate");
const alks_profiles_list_1 = require("./handlers/alks-profiles-list");
const alks_profiles_remove_1 = require("./handlers/alks-profiles-remove");
const alks_profiles_get_1 = require("./handlers/alks-profiles-get");
const outputValues = (0, getOutputValues_1.getOutputValues)();
const nameDesc = 'alphanumeric including @+=._-';
const trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';
const program = new commander_1.Command();
program.exitOverride();
program.configureOutput({
    writeErr: (str) => {
        if (!str.startsWith('error: unknown command')) {
            process.stderr.write(str);
        }
    },
});
program
    .version(package_json_1.version, '--version')
    .option('-v, --verbose', "be verbose, but don't print secrets")
    .option('-V, --unsafe-verbose', 'be verbose, including secrets (be careful where you share this output)')
    .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().unsafeVerbose) {
        console.error((0, cli_color_1.red)('Warning: Unsafe loggin mode is activated which means that secrets may be printed in the output below. Do not share the output of this CLI with anyone while this mode is active'));
    }
});
program
    .command('completion')
    .description('shell completer for cli commands')
    .action(alks_completion_1.handleCompletion);
function addChangeRequestOptions(command) {
    return command
        .option('--ciid <ciid>', 'Component ID for change request. Mutually exclusive with --chg-number')
        .option('--activity-type <type>', 'activity type for change request. Required with --ciid')
        .option('--description <desc>', 'description for change request. Required with --ciid')
        .option('--chg-number <number>', 'Pre-generated change request ticket number. Mutually exclusive with --ciid');
}
const sessions = program
    .command('sessions')
    .alias('session')
    .description('manage aws sessions');
sessions;
const sessionsOpenCommand = sessions
    .command('open')
    .description('creates or resumes a session')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-i, --iam', 'create an IAM session. This flag is deprecated since it is no longer needed and will not make a difference in the generated session credentials')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .option('-D, --duration <duration>', 'the duration of the session in hours. If the duration is over the max duration allowed for the role, the max duration will be used instead', '12')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-p, --password <password>', 'my password')
    .option('-o, --output <format>', 'output format (' + outputValues.join(', ') + ')')
    .option('-n, --namedProfile <profile>', 'alias for --profile, if output is set to creds, use this profile, default: default')
    .option('-P, --profile <profile>', 'if output is set to creds, use this profile, default: default')
    .option('-f, --force', 'if output is set to creds, force overwriting of AWS credentials')
    .option('-F, --favorites', 'filters favorite accounts');
addChangeRequestOptions(sessionsOpenCommand).action(alks_sessions_open_1.handleAlksSessionsOpen);
sessions
    .command('list')
    .alias('ls')
    .description('list active sessions')
    .option('-p, --password <password>', 'my password')
    .action(alks_sessions_list_1.handleAlksSessionsList);
const sessionsConsoleCommand = sessions
    .command('console')
    .description('open an AWS console in your browser')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-i, --iam', 'create an IAM session')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-u, --url', 'just print the url')
    .option('-o, --openWith <openWith>', 'open in a different app (optional)')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-p, --password <password>', 'my password');
addChangeRequestOptions(sessionsConsoleCommand).action(alks_sessions_console_1.handleAlksSessionsConsole);
const iam = program.command('iam').description('manage iam resources');
iam
    .command('roletypes')
    .alias('role-types')
    .alias('list-role-types')
    .description('list the available iam role types. We recommend specifying the trust policy when creating roles instead since role types are a legacy feature and no new role types are being created for new AWS services')
    .option('-o, --output <format>', 'output format (' + (0, getOutputValues_1.getOutputValuesRoleTypes)().join(', ') + ')', (0, getOutputValues_1.getOutputValuesRoleTypes)()[0])
    .action(alks_iam_roletypes_1.handleAlksIamRoleTypes);
iam
    .command('deleterole')
    .alias('delete-role')
    .description('remove an IAM role')
    .option('-n, --rolename <rolename>', 'the name of the role to delete')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_iam_deleterole_1.handleAlksIamDeleteRole);
iam
    .command('deleteltk')
    .alias('delete-ltk')
    .description('deletes an IAM long term key/IAM User')
    .option('-n, --iamusername <iamUsername>', 'the name of the iam user associated with the LTK')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_iam_deleteltk_1.handleAlksIamDeleteLtk);
iam
    .command('createtrustrole')
    .alias('create-trust-role')
    .description('(Deprecated - use `alks iam create-role` instead) creates a new IAM Trust role')
    .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
    .option('-t, --roletype <roletype>', 'the role type: Cross Account or Inner Account')
    .option('-T, --trustarn <trustarn>', 'trust arn, ' + trustArnDesc)
    .option('-e, --enableAlksAccess', 'enable alks access (MI), default: false', false)
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-k, --tags <tags...>', `A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string`)
    .action(alks_iam_createtrustrole_1.handleAlksIamCreateTrustRole);
iam
    .command('createrole')
    .alias('create-role')
    .description('creates a new IAM role')
    .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
    .option('-t, --roletype <roletype>', 'the role type, to see available roles: alks iam roletypes. Must provide role type or trust policy. We recommend specifying the trust policy instead since role types are a legacy feature and no new role types are being created for new AWS services')
    .option('-p,  --trustPolicy <trustPolicy>', 'the trust policy as JSON string, must provide trust policy or role type')
    .option('-d, --defaultPolicies', 'include default policies, default: false', false)
    .option('-e, --enableAlksAccess', 'enable alks access (MI), default: false', false)
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-k, --tags <tags...>', `A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string`)
    .option('-T, --template-fields <templateFields...>', `key-value pairs used to populate template fields in the trust policy document of the role. Can either be a JSON string like '{"key1":"value1","key2":"value2"}' or a list of pairs like key1=value1,key2=value2`)
    .action(alks_iam_createrole_1.handleAlksIamCreateRole);
iam
    .command('createltk')
    .alias('create-ltk')
    .description('creates a new IAM long term key/IAM User')
    .option('-n, --iamusername <iamUsername>', 'the name of the iam user associated with the LTK, ' + nameDesc)
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-o, --output <format>', 'output format (text, json)', 'text')
    .option('-k, --tags <tags...>', `A list of resource tags. Can either be a JSON representation ['{"Key":"key1", "Value":"val1"}', '{"Key":"key2", "Value":"val2"}'] or shorthand Key=string,Value=string Key=string,Value=string`)
    .action(alks_iam_createltk_1.handleAlksIamCreateLtk);
iam
    .command('updaterole')
    .alias('update-role')
    .description('updates an existing IAM role')
    .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
    .option('-p,  --trustPolicy <trustPolicy>', 'the trust policy as JSON string')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-k, --tags <tags...>', `A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string`)
    .action(alks_iam_updaterole_1.handleAlksIamUpdateRole);
iam
    .command('updateIamUser')
    .alias('updateltk')
    .alias('update-ltk')
    .description('Updates the tags on an IAM long term key/IAM User')
    .option('-n, --iamusername <iamUsername>', 'the name of the iam user to update, ' + nameDesc)
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-o, --output <format>', 'output format (text, json)', 'text')
    .option('-k, --tags <tags...>', `A list of resource tags. Can either be a JSON representation ['{"Key":"key1", "Value":"val1"}', '{"Key":"key2", "Value":"val2"}'] or shorthand Key=string,Value=string Key=string,Value=string`)
    .action(alks_iam_updateiamuser_1.handleAlksIamUpdateIamUser);
const developer = program
    .command('developer')
    .description('developer & account commands');
developer
    .command('configure')
    .description('configures developer')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account to use as a default account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use as the default role for carrying out requests')
    .option('-o, --output <format>', 'output format')
    .option('-u, --username <username>', 'your network username. NOTE: this is not your email prefix')
    .option('-s, --server <server>', 'alks server')
    .option('-A, --auth-type <authType>', 'automatically selects the auth type provided')
    .option('--credential-process <scriptPath>', 'the path to your credential_process script. Automatically sets the auth-type to credential-process')
    .option('--non-interactive', 'do not prompt for anything. When this flag is passes, only fields passed via command-line arguments will be set')
    .action(alks_developer_configure_1.handleAlksDeveloperConfigure);
developer
    .command('accounts')
    .description('shows current developer configuration')
    .option('-e, --export', 'export accounts to environment variables')
    .option('-o, --output <format>', 'output format (' + (0, getOutputValues_1.getOutputValuesAccounts)().join(', ') + ')', (0, getOutputValues_1.getOutputValuesAccounts)()[0])
    .action(alks_developer_accounts_1.handleAlksDeveloperAccounts);
developer
    .command('favorites')
    .description('configure which accounts are favorites')
    .action(alks_developer_favorites_1.handleAlksDeveloperFavorites);
developer
    .command('info')
    .description('shows current developer configuration')
    .action(alks_developer_info_1.handleAlksDeveloperInfo);
developer
    .command('login')
    .description('stores password')
    .option('-u, --username <username>', 'your username')
    .action(alks_developer_login_1.handleAlksDeveloperLogin);
developer
    .command('login2fa')
    .description('stores your alks refresh token')
    .action(alks_developer_login2fa_1.handleAlksDeveloperLogin2fa);
developer
    .command('logout')
    .description('removes password')
    .action(alks_developer_logout_1.handleAlksDeveloperLogout);
developer
    .command('logout2fa')
    .description('removes alks refresh token')
    .action(alks_developer_logout2fa_1.handleAlksDeveloperLogout2fa);
const server = program
    .command('server')
    .name('server')
    .description('ec2 metadata server');
server
    .command('stop')
    .description('stops the metadata server')
    .action(alks_server_stop_1.handleAlksServerStop);
server
    .command('start')
    .description('starts the metadata server')
    .action(alks_server_start_1.handleAlksServerStart);
server
    .command('configure')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use to perform the request')
    .option('-i, --iam', 'create an IAM session')
    .option('-p, --password <password>', 'my password')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_server_configure_1.handleAlksServerConfigure);
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
    .option('-A, --all', 'generate profiles for all accounts/roles that you have access to')
    .option('-a, --account <accountIdOrAlias>', 'the 12-digit ID or alias for an AWS account to use for the profile')
    .option('-r, --role <authRole>', 'the ALKS IAM role to use for the profile')
    .option('-n, --namedProfile <profile>', 'alias for --profile, the name of the profile to generate. If not specified the "default" profile will be updated')
    .option('-P, --profile <profile>', 'the name of the profile to generate. If not specified the "default" profile will be updated')
    .option('-f, --force', 'if output is set to creds, force overwriting of AWS credentials')
    .action(alks_profiles_generate_1.handleAlksProfilesGenerate);
profiles
    .command('list')
    .alias('ls')
    .description('list aws profiles')
    .option('-A, --all', 'list all profiles including those not managed by alks', false)
    .option('-o, --output <format>', 'output format (list, json)', 'list')
    .option('-S, --show-sensitive-values', 'show sensitive values in the output as opposed to replacing them with asterisks', false)
    .action(alks_profiles_list_1.handleAlksProfilesList);
profiles
    .command('remove')
    .alias('rm')
    .alias('delete')
    .description('delete aws profiles')
    .option('-A, --all', 'delete profiles for all accounts/roles that you have access to that are managed by alks')
    .option('-n, --namedProfile <profile>', 'alias for --profile, the name of the profile to generate. If not specified the "default" profile will be updated')
    .option('-P, --profile <profile>', 'the name of the profile to generate. If not specified the "default" profile will be updated')
    .option('-f, --force', 'skip the confirmation prompt and delete the profile(s)')
    .action(alks_profiles_remove_1.handleAlksProfilesRemove);
profiles
    .command('get')
    .description('get aws profile')
    .option('-n, --namedProfile <profile>', 'alias for --profile, the name of the profile to generate. If not specified the "default" profile will be updated')
    .option('-P, --profile <profile>', 'the name of the profile to generate. If not specified the "default" profile will be updated')
    .option('-o, --output <format>', 'output format (text, json)', 'text')
    .option('-S, --show-sensitive-values', 'show sensitive values in the output as opposed to replacing them with asterisks', false)
    .action(alks_profiles_get_1.handleAlksProfilesGet);
exports.default = program;
//# sourceMappingURL=program.js.map