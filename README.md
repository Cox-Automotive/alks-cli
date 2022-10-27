# ALKS CLI

[![NPM](https://nodei.co/npm/alks.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/alks/)

[![Build Status](https://travis-ci.org/Cox-Automotive/alks-cli.svg?branch=master)](https://travis-ci.org/Cox-Automotive/alks-cli)

## About
CLI for working with the ALKS service.

### Prerequisites

To install and use the ALKS CLI, you will need Node.js (version 10 or greater) and NPM ([nodejs.org](https://nodejs.org/en/download/package-manager)).

## Installing

ALKS CLI is meant to be installed via NPM.

```
npm install -g alks
```

## Configuring

The ALKS CLI requires some basic environment information to get started. Simply run the configuration command and you'll be prompted for the necessary configuration settings.

    alks developer configure

* ALKS Server: The full URL to your ALKS server (ex: `https://alks.company.com/rest`)
* Network Username: Your network username
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

* `-p [password]` Your password
* `-a [account]` The ALKS account to use, be sure to wrap in quotes
* `-r [role]` The ALKS role to use, be sure to wrap in quotes
* `-i` Specifies you wish to work as an IAM/Admin user
* `-o [output]` Output format. Supports: `env`, `json`, `docker`, `creds`, `idea`, `export`, `set`, `powershell`, `aws`, `fishshell`, `terraformenv`, `terraformarg`
* `-n` If output is set to creds, use this named profile (defaults to default)
* `-N` Forces a new session to be generated
* `-d` Uses your default account from `alks developer configure`
* `-f` If output is set to creds, force overwriting of AWS credentials if they already exist
* `-F` Filters favorite accounts

Output values:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_SESSION_TOKEN`

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

* `-p [password]` Your password

## IAM

### `iam createrole`

`alks iam createrole` Creates a new IAM role for the requested type in the specified AWS account.

Arguments:

* `-p [password]` Your password
* `-n [roleName]` The name of the role, be sure to wrap in quotes, alphanumeric including: `@+=._-`
* `-t [roleType]` The role type, to see available roles: `alks iam roletypes`, be sure to wrap in quotes.  Must include roleType or trust policy, but not both
* `-p [trustPolicy]` A trust policy as a JSON string.  Must include trustPolicy or roleType, but not both
* `-d`: Include default policies, defaults to false
* `-F` Filters favorite accounts
* `-k [tags]` A list of resource tags. Can either be a JSON representation '[{"Key":"string","Value":"string"},{"Key":"string","Value":"string"}]' or shorthand Key=string,Value=string Key=string,Value=string

Outputs the created role's ARN.

### `iam createtrustrole`

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

* `-p [password]` Your password
* `-n [roleName]` The name of the role, be sure to wrap in quotes, alphanumeric including: `@+=._-`

### `iam roletypes`

`alks iam roletypes` - List the available IAM role types.

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

* `-p [password]` Your password
* `-n [iamusername]` The name of the IAM user, be sure to wrap in quotes, alphanumeric including: `@+=._-`

## Metadata Server

The metadata server listens on http://169.254.169.254 and mimicks the [AWS EC2 Instance Metadata server](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html). If you request credentials from http://169.254.169.254/latest/meta-data/iam/security-credentials/alks it will ensure you have a valid set of up-to-date credentials from ALKS. The account and role used can be changed at any time by running `alks server configure`.

### `server configure`

`alks server configure` - Configure the account and role used by the metadata server. This can also be invoked while the server is running.

Arguments:

* `-p [password]` Your password
* `-a [account]` The ALKS account to use, be sure to wrap in quotes
* `-r [role]` The ALKS role to use, be sure to wrap in quotes
* `-i` Specifies you wish to work as an IAM/Admin user
* `-F` Filters favorite accounts

### `server start`

`alks server start` - Start the metadata server.

### `server stop`

`alks server stop` - Stop the metadata server.

# Output Formats

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
