# ALKS CLI

[![NPM](https://nodei.co/npm/alks.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/alks/)

[![Build Status](https://travis-ci.org/Cox-Automotive/alks-cli.svg?branch=master)](https://travis-ci.org/Cox-Automotive/alks-cli)

## About
CLI for working with the ALKS service.

### Prerequisites

To install and use the ALKS CLI, you will need Node.js (version 10 or greater) and NPM ([nodejs.org](https://nodejs.org/en/download/package-manager)).

## Installing

ALKS CLI is meant to be installed via NPM from Cox Automotive's internal Artifactory registry.

### Configure NPM for Artifactory

Before installing, you need to configure NPM to use the Cox Automotive Artifactory registry. Add the following to your `~/.npmrc` file:

```
registry=https://artifactory.coxautoinc.com/artifactory/api/npm/cai-npm/
//artifactory.coxautoinc.com/artifactory/api/npm/cai-npm/:_auth=<YOUR_ARTIFACTORY_TOKEN>
```

Replace `<YOUR_ARTIFACTORY_TOKEN>` with your Artifactory authentication token. You can obtain your token from [artifactory.coxautoinc.com](https://artifactory.coxautoinc.com) under your user profile settings.

Alternatively, if you're already authenticated with JFrog CLI, you can use:

```
jf npm-config --repo-resolve cai-npm
```

**Need help?** If you have questions about configuring your `.npmrc` file or accessing Artifactory, ask in the [#artifactory](https://cox.enterprise.slack.com/archives/C8Y7NP7HN) Slack channel.

### Install ALKS CLI

Once configured, install ALKS CLI globally:

```
npm install -g alks
```

### Public NPM Registry (Deprecated)

ALKS CLI is also available on the public NPM registry for external users:

```
npm install -g alks --registry=https://registry.npmjs.org/
```

## Configuring

The ALKS CLI requires some basic environment information to get started. Simply run the configuration command and you'll be prompted for the necessary configuration settings.

    alks developer configure

* ALKS Server: The full URL to your ALKS server (ex: `https://alks.company.com/rest`)
* Network Username: Your network username. Note: This is not your email prefix and can be found on the ALKS Users tab for an account at alks.coxautoinc.com
* Network Password: Your network password (needed for loading list of accounts/roles)
* Save Network Password: Whether or not to save your network password, we suggest saving your password for ease of use
* Default Account/Role: Select the default ALKS account/role to use
* Default Output Format: Select the default format to use when printing information such as ALKS Keys

Some commands will also work without configuration if the `ALKS_SERVER`, `ALKS_USERID`, and either `ALKS_PASSWORD` or `ALKS_REFRESH_TOKEN` environment variables are set, although you may be required to specify the output format, account, or role to use explicitly via CLI flags since no default configuration is set in this case.

## Running

After installing the ALKS CLI it will be available on your path. Simply run the following to see a list of supported commands:

    alks

### Options

To see a what options are available to a command ask for help on it:

    alks sessions help open

### Password

Since ALKS requires you to pass your credentials, we've made the CLI provide multiple ways of handling this.

1. **Recommended:** Store your password in the keychain. We offer the ability to store your password securely using built in OS functionality. On MacOS we use Keychain, on Windows we use Credential Vault and on Linux we use netrc. To store your password simply run `alks developer login` and follow the prompt. You can remove your password at any time by running `alks developer logout`.
2. Provide your password as an argument, simply pass `-p 'my pass!'`. Note this will appear in your Bash history.
3. Create an environment variable called `ALKS_PASSWORD` whose value is your password.
4. Type your password. If we do not find a password we will prompt you on each use.


#### Password Priority

We will attempt to lookup your password in the following order:

1. CLI argument
2. Environment variable
3. Keystore
4. Prompt user

### Two Factor Authentication

The preferred authentication mechanism is two-factor authentication. Simply log into the ALKS GUI and get your refresh token which we will securely store just like your password.

*Note:* Credential authentication will be removed in a future release of the ALKS CLI.

## Docker

If you would rather run the ALKS CLI as a Docker container, simply run the following:

```
docker run -it -v ~:/root coxauto/alks-cli
```

If you are on a windows host and need SET instead of export then add a PLATFORM env:

```
docker run -it -e PLATFORM=windows -v %USERPROFILE%:/root coxauto/alks-cli sessions open -a %AWS_ACCT% -r %AWS_ROLE% -o env
```

# Commands

## Developer

### `developer configure`

`alks developer configure` - Configures ALKS

### `developer login`

`alks developer login` - Store your login credentials in the OS keychain.

### `developer logout`

`alks developer logout` - Remove your login credentials from the OS keychain.

### `developer login2fa`

`alks developer login2fa` - Store your 2FA refresh token in the OS keychain.

### `developer logout2fa`

`alks developer logout2fa` - Remove your 2FA refresh token from the OS keychain.

### `developer info`

`alks developer info` - Show your current developer configuration

### `developer accounts`

`alks developer accounts` - Show all available ALKS accounts (both Standard and IAM)

### `developer favorites`

`alks developer favorites` - Configure which accounts are favorites

## Sessions

### `sessions open`

`alks sessions open` Creates/resumes an ALKS session, this is the preferred way of using ALKS as it automates the underlying ALKS session for you. If you don't provide an account/role you'll be prompted for the one you'd like to use. Alternative you can use your default account/role by passing `-d`.

This will create your sessions with the maximum life and automatically renew them when necessary. If you would like to do IAM/Admin work you'll need to pass the `-i` flag.

Arguments:

* `-a [account]` The ALKS account to use, be sure to wrap in quotes
* `-r [role]` The ALKS role to use, be sure to wrap in quotes
* `-i` Specifies you wish to work as an IAM/Admin user. This flag is deprecated since it is no longer needed and will not make a difference in the generated session credentials
* `-o [output]` Output format. Supports: `env`, `json`, `docker`, `creds`, `idea`, `export`, `set`, `powershell`, `aws`, `fishshell`, `terraformenv`, `terraformarg`
* `-n` If output is set to creds, use this named profile (defaults to default)
* `-N` Forces a new session to be generated
* `-d` Uses your default account from `alks developer configure`
* `-f` If output is set to creds, force overwriting of AWS credentials if they already exist
* `-F` Filters favorite accounts
* `-p [password]` Your password (only needed if not currently authenticated and using basic authentication)

Output values:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_SESSION_TOKEN`

Example:

Creating a new session under the default profile in your `~/.aws/credentials` file. (Note: if you still get errors saying access is denied after generating a new session like this, you may need to clear any environment variables prefixed with `AWS_` since credentials found in those variables, even if they are expired, will take precedence over your `~/.aws/credentials` file)
```sh
alks sessions open -a 'awstest123' -r 'Admin' --duration 1  -o creds -f
```

Creating a new session by using environment variables (Note: due to a limitation with shell commands, the ALKS CLI is only able to output the commands used to set environment variables but it cannot set them for you. That is why you have to wrap a call like this with `eval`)
```sh
eval $(alks sessions open -a 'awstest123' -r 'Admin' --duration 1 -o env)
```

### `sessions console`

`alks sessions console` - Open the AWS console in the default browser for the specified ALKS session.

Arguments:

* `-p [password]` Your password
* `-u [url]` Print the URL
* `-a [account]` The ALKS account to use, be sure to wrap in quotes
* `-r [role]` The ALKS role to use, be sure to wrap in quotes
* `-i` Specifies you wish to work as an IAM/Admin user
* `-o [appName]` Open with an alternative app (safari, google-chrome, etc)
* `-N` Forces a new session to be generated
* `-d` Uses your default account from `alks developer configure`
* `-p [password]` Your password
* `-F` Filters favorite accounts

### `sessions list`

`alks sessions list` - List active ALKS sessions, this includes both IAM and non-IAM sessions.

Arguments:

* `-p [password]` Your password (only needed if not currently authenticated and using basic authentication)

## IAM

### `iam createrole`

`alks iam createrole` Creates a new IAM role for the requested type in the specified AWS account.

Arguments:

* `-a [account]` The ALKS account to use, be sure to wrap in quotes
* `-r [role]` The ALKS login role to use to create your role, be sure to wrap in quotes
* `-n [roleName]` The name of the role, be sure to wrap in quotes, alphanumeric including: `@+=._-`
* `-p [trustPolicy]` A trust policy as a JSON string.  Must include trustPolicy or roleType, but not both
* `-t [roleType]` The role type, to see available roles: `alks iam roletypes`, be sure to wrap in quotes.  Must include roleType or trust policy, but not both. We recommend specifying the trust policy instead since role types are a legacy feature and no new role types are being created for new AWS services
* `-d`: Include default policies, defaults to false
* `-F` Filters favorite accounts
* `-k [tags]` A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string
* `-p [password]` Your password (only needed if not currently authenticated and using basic authentication)

Outputs the created role's ARN.

Example:

```sh
alks iam createrole -a 'awstest123' -r 'Admin' -n 'MyRole' -p '{"Version":"2012-10-17","Statement":[{"Action":"sts:AssumeRole","Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"}}]}'
```

### `iam createtrustrole`

DEPRECATED: we recommend using `iam createrole` instead since you can use it to create all the same types of roles as this command and more

`alks iam createtrustrole` Creates a new IAM Trust role for the requested type in the specified AWS account.

Arguments:

* `-T [trustarn]` Your trust arn
* `-n [roleName]` The name of the role, be sure to wrap in quotes, alphanumeric including: `@+=._-`
* `-t [roleType]` The role type `Cross Account` or `Inner Account`, be sure to wrap in quotes
* `-a [alksAccount]`: ALKS account to use
* `-r [alksRole]`: ALKS role to use
* `-k [tags]` A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string
* `-F` Filters favorite accounts

Outputs the created role's ARN.

### `iam deleterole`

`alks iam deleterole` Deletes a previously created IAM role in the specified AWS account. Note this only works for IAM roles that were created with ALKS.

Arguments:

* `-a [account]` The ALKS account to use, be sure to wrap in quotes
* `-r [role]` The ALKS login role to use to create your role, be sure to wrap in quotes
* `-n [roleName]` The name of the role, be sure to wrap in quotes, alphanumeric including: `@+=._-`
* `-p [password]` Your password (only needed if not currently authenticated and using basic authentication)

```sh
alks iam deleterole -a 'awstest123' -r 'Admin' -n 'MyRole'
```

### `iam roletypes`

`alks iam roletypes` - List the available IAM role types. We recommend specifying the trust policy when creating roles instead since role types are a legacy feature and no new role types are being created for new AWS services

Arguments:

* `-o [output]` Output format. Supports: `json`, `list`

Outputs a list of available role types.

### `iam createltk`

`alks iam createltk` Creates a new long term key in the specified AWS account.

Arguments:

* Required
    * `-a [account]` The ALKS account to use, be sure to wrap in quotes
    * `-n [iamusername]` The name of the IAM user associated with the LTK, be sure to wrap in quotes, alphanumeric including: `@+=._-`
* Optional
    * `-o [output]` Output format. Supports: `text`, `json`. Default: `text`
    * `-r [role]` The ALKS role to use, be sure to wrap in quotes
    * `-F` Filters favorite accounts
    * `-k [tags]` A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string

Outputs the created user's ARN along with the long term access key and long term secret key.

### `iam updateIamUser`

`alks iam updateIamUser` Updates Tags on IamUser (ltk) with give iamusername.

Arguments:

* Required
    * `-a [account]` The ALKS account to use, be sure to wrap in quotes
    * `-n [iamusername]` The name of the IAM user associated with the LTK, be sure to wrap in quotes, alphanumeric including: `@+=._-`
    * `-k [tags]` A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string
* Optional
    * `-o [output]` Output format. Supports: `text`, `json`. Default: `text`
    

Outputs the created user's ARN along with the long term access key and long term secret key.

### `iam deleteltk`

`alks iam deleteltk` Deletes a previously created LTK in the specified AWS account.

Arguments:

* `-p [password]` Your password (only needed if not currently authenticated and using basic authentication)
* `-n [iamusername]` The name of the IAM user, be sure to wrap in quotes, alphanumeric including: `@+=._-`

## Metadata Server

The metadata server listens on http://169.254.169.254 and mimicks the [AWS EC2 Instance Metadata server](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html). If you request credentials from http://169.254.169.254/latest/meta-data/iam/security-credentials/alks it will ensure you have a valid set of up-to-date credentials from ALKS. The account and role used can be changed at any time by running `alks server configure`.

### `server configure`

`alks server configure` - Configure the account and role used by the metadata server. This can also be invoked while the server is running.

Arguments:

* `-p [password]` Your password (only needed if not currently authenticated and using basic authentication)
* `-a [account]` The ALKS account to use, be sure to wrap in quotes
* `-r [role]` The ALKS role to use, be sure to wrap in quotes
* `-i` Specifies you wish to work as an IAM/Admin user
* `-F` Filters favorite accounts

### `server start`

`alks server start` - Start the metadata server.

### `server stop`

`alks server stop` - Stop the metadata server.

## Profile Management

### `profiles generate`

`alks profiles generate` Creates an AWS profile or multiple profiles. If you pass an account, role, and profile name it will generate a single profile in your `~/.aws/credentials` file and if you instead pass the `--all` flag it will generate profiles for all the account/role pairs that you currently have access to by naming each profile `<accountAlias>-<roleName>`

Try running `alks profiles generate --help` for more details on how to use this command

### `profiles list`

Lists the profiles that you have. By default this will only print out the profiles that were created by this tool but you can list all of your profiles by passing the `--all` flag.

Try running `alks profiles list --help` for more details on how to use this command

### `profiles get`

Gets the details for a single AWS profile. Essentially this will show you everything in the `~/.aws/credentials` file for a single profile

Try running `alks profiles get --help` for more details on how to use this command

### `profiles remove`

Removes an AWS profile, or multiple AWS profiles. If you specify a profile name this will remove just that single profile, or if you pass the `--all` flag this will remove all profiles that were generated with this tool

Try running `alks profiles remove --help` for more details on how to use this command



# Output Formats trigger

ALKS CLI will output in a variety of formats, it uses the developer default (set with `alks developer configure`) and can be overridden by passing a value via `-o`.

* `env`: Outputs Bash/Windows environment variable string. You can wrap this call in an eval:  `eval $(alks sessions open -d)`
* `json`: Outputs a JSON object
* `docker`: Outputs environment arguments to pass to a Docker run call
* `creds`: Updates the AWS credentials file
	* By default this will update the default profile, to use another named profile supply: `-n namedProfile`
	* If the named profile already exists you'll need to supply the overwrite flag: `-f`
* `idea`: Outputs environment variables formatted for Intelli-J
* `export`: Outputs environment variables via `export`
* `set`: Outputs environment variables via `SET`
* `powershell`: Outputs environment variables for Windows PowerShell
* `fishshell`: Outputs environment variables for Fishshell
* `terraformenv`: Outputs environment variables prefixed with `ALKS`
* `terraformarg`: Outputs environment arguments to pass to a Docker run call prefixed with `ALKS`
* `aws`: Outputs environment arguments to pass to AWS [docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sourcing-external.html)
