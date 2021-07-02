"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var package_json_1 = require("../../package.json");
var getOutputValues_1 = require("../lib/getOutputValues");
var alks_sessions_open_1 = require("../lib/handlers/alks-sessions-open");
var alks_developer_configure_1 = require("../lib/handlers/alks-developer-configure");
var alks_sessions_list_1 = require("../lib/handlers/alks-sessions-list");
var alks_sessions_console_1 = require("../lib/handlers/alks-sessions-console");
var alks_server_stop_1 = require("../lib/handlers/alks-server-stop");
var alks_server_start_1 = require("../lib/handlers/alks-server-start");
var alks_server_configure_1 = require("../lib/handlers/alks-server-configure");
var alks_iam_roletypes_1 = require("../lib/handlers/alks-iam-roletypes");
var alks_iam_deleterole_1 = require("../lib/handlers/alks-iam-deleterole");
var alks_iam_deleteltk_1 = require("../lib/handlers/alks-iam-deleteltk");
var alks_iam_createtrustrole_1 = require("../lib/handlers/alks-iam-createtrustrole");
var alks_iam_createrole_1 = require("../lib/handlers/alks-iam-createrole");
var alks_iam_createltk_1 = require("../lib/handlers/alks-iam-createltk");
var alks_developer_accounts_1 = require("../lib/handlers/alks-developer-accounts");
var alks_developer_favorites_1 = require("../lib/handlers/alks-developer-favorites");
var alks_developer_info_1 = require("../lib/handlers/alks-developer-info");
var alks_developer_login_1 = require("../lib/handlers/alks-developer-login");
var alks_developer_login2fa_1 = require("../lib/handlers/alks-developer-login2fa");
var alks_developer_logout_1 = require("../lib/handlers/alks-developer-logout");
var alks_developer_logout2fa_1 = require("../lib/handlers/alks-developer-logout2fa");
var outputValues = getOutputValues_1.getOutputValues();
var nameDesc = 'alphanumeric including @+=._-';
var trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';
var program = new commander_1.Command();
program.exitOverride();
program.configureOutput({
    writeErr: function (str) {
        if (!str.startsWith('error: unknown command')) {
            process.stderr.write(str);
        }
    },
});
program.version(package_json_1.version).option('-v, --verbose', 'be verbose');
var sessions = program.command('sessions').description('manage aws sessions');
sessions
    .command('open')
    .description('creates or resumes a session')
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-p, --password <password>', 'my password')
    .option('-o, --output <format>', 'output format (' + outputValues.join(', ') + ')')
    .option('-n, --namedProfile <profile>', 'if output is set to creds, use this profile, default: default')
    .option('-f, --force', 'if output is set to creds, force overwriting of AWS credentials')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .action(alks_sessions_open_1.handleAlksSessionsOpen);
sessions
    .command('list')
    .description('list active sessions')
    .option('-p, --password <password>', 'my password')
    .action(alks_sessions_list_1.handleAlksSessionsList);
sessions
    .command('console')
    .description('open an AWS console in your browser')
    .option('-u, --url', 'just print the url')
    .option('-o, --openWith <appName>', 'open in a different app (optional)')
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-p, --password <password>', 'my password')
    .option('-N, --newSession', 'forces a new session to be generated')
    .option('-d, --default', 'uses your default account from "alks developer configure"')
    .action(alks_sessions_console_1.handleAlksSessionsConsole);
var iam = program.command('iam').description('manage iam resources');
iam
    .command('roletypes')
    .description('list the available iam role types')
    .option('-o, --output <format>', 'output format (' +
    outputValues.join(', ') +
    '), default: ' +
    outputValues[0], outputValues[0])
    .action(alks_iam_roletypes_1.handleAlksIamRoleTypes);
iam
    .command('deleterole')
    .description('remove an IAM role')
    .option('-n, --rolename <rolename>', 'the name of the role to delete')
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_iam_deleterole_1.handleAlksIamDeleteRole);
iam
    .command('deleteltk')
    .description('deletes an IAM Longterm Key')
    .option('-n, --iamusername <iamUsername>', 'the name of the iam user associated with the LTK')
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_iam_deleteltk_1.handleAlksIamDeleteLtk);
iam
    .command('createtrustrole')
    .description('creates a new IAM Trust role')
    .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
    .option('-t, --roletype <roletype>', 'the role type: Cross Account or Inner Account')
    .option('-T, --trustarn <trustarn>', 'trust arn, ' + trustArnDesc)
    .option('-e, --enableAlksAccess', 'enable alks access (MI), default: false', false)
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_iam_createtrustrole_1.handleAlksIamCreateTrustRole);
iam
    .command('createrole')
    .description('creates a new IAM role')
    .option('-n, --rolename <rolename>', 'the name of the role, ' + nameDesc)
    .option('-t, --roletype <roletype>', 'the role type, to see available roles: alks iam roletypes')
    .option('-d, --defaultPolicies', 'include default policies, default: false', false)
    .option('-e, --enableAlksAccess', 'enable alks access (MI), default: false', false)
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_iam_createrole_1.handleAlksIamCreateRole);
iam
    .command('createltk')
    .description('creates a new IAM Longterm Key')
    .option('-n, --iamusername <iamUsername>', 'the name of the iam user associated with the LTK, ' + nameDesc)
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-F, --favorites', 'filters favorite accounts')
    .option('-o, --output <format>', 'output format (text, json)', 'text')
    .action(alks_iam_createltk_1.handleAlksIamCreateLtk);
var developer = program
    .command('developer')
    .description('developer & account commands');
developer
    .command('configure')
    .description('configures developer')
    .option('-a, --account <alksAccount>', 'alks account to use as the default account')
    .option('-r, --role <alksRole>', 'alks role to use as the default role')
    .option('-o, --output <format>', 'output format (text, json)', 'text')
    .option('-u, --username <username>', 'your username')
    .option('-p, --password', 'causes the cli to automatically prompt for your password (cannot be used with -t/--token)')
    .option('-t, --token', 'causes the cli to automatically prompt for your refresh token (cannot be used with -p/--password)')
    .action(alks_developer_configure_1.handleAlksDeveloperConfigure);
developer
    .command('accounts')
    .description('shows current developer configuration')
    .option('-e, --export', 'export accounts to environment variables')
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
var server = program.command('server').description('ec23 metadata server');
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
    .option('-a, --account <alksAccount>', 'alks account to use')
    .option('-r, --role <alksRole>', 'alks role to use')
    .option('-i, --iam', 'create an IAM session')
    .option('-p, --password <password>', 'my password')
    .option('-F, --favorites', 'filters favorite accounts')
    .action(alks_server_configure_1.handleAlksServerConfigure);
exports.default = program;
//# sourceMappingURL=program.js.map