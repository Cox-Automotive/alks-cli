#ALKS CLI

[![NPM](https://nodei.co/npm/alks.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/alks/)

## About
CLI for working with the ALKS service.

### Prerequisites

To install and use alks, you will need Node.js (version 4 or greater) and npm  ([nodejs.org](https://nodejs.org/en/download/package-manager)).

## Installing

ALKS CLI is meant to be installed via NPM.

```
npm install -g alks
```

## Configuring

ALKS relies on a dotfile for its configuration. Create *alks.env* and save it in your home directory. Be sure to fill out all values from the sample below:

### Sample alks.env

```
ALKS_SERVER=https://server.alks
ALKS_USERID=mynetworkaccount
ALKS_ACCOUNT=account from ALKS to use
ALKS_ROLE=role from ALKS to use
```

## Running

After installing ALKS it will be available on your path. Simply run the following to see a list of supported commands:

    alks

### Options

To see a what options are available to a command ask for help on it:

    alks keys help create

### Password

Since ALKS requires you to pass your credentials, we've made the CLI provide multiple ways of handling this. 

1. Store your password in the keychain. We offer the ability to store your password securely using build in OS functionality. On OS X we use Keychain, on Windows we use Credential Vault and Linux uses Gnome Keyring. To store your password simply run `alks developer login` and follow the prompt. You can remove your password at any time by running `alks developer logout`.
2. Provide your password as an argument, simply pass `-p 'my pass!'`. Note this will appear in your Bash history.
3. Create an environment variable called `ALKS_PASSWORD` whose value is your password.
4. Type your password. If we do not find a password we will prompt you on each use.


#### Password Priority

We will attempt to lookup your password in the following order:

1. CLI argument
2. Environment variable
3. Keystore
4. Prompt user  

## Docker

If you would rather run the ALKS CLI as a Docker container, simply run the following:

```
docker run -it -v ~:/root coxauto/alks-cli
```

# Commands

## Developer

### `developer login`

`alks developer login` - Store your login credentials in the OS keychain.

### `developer logout`

`alks developer logout` - Remove your login credentials from the OS keychain.

### `developer info`

`alks developer info` - Show your current developer configuration

## Keys

### `keys create`

`alks keys create` - Create a new session key with the ALKS service

Optional arguments:

* `-p [password]` Your password
* `-d [duration]` Duration of the key, in hours. Supports: 2, 6, 12, 18, 24, 36
* `-o [output]` Output format. Supports: `json`, `env`, `docker`, `creds`
* `-f` If output is set to creds, force overwriting of default AWS credentials if they already exist

Output values:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_SESSION_TOKEN`

### `keys list`

`alks keys list` - List existing ALKS keys as well as output them. Your keys are stored encrypted using AES-256.

Optional arguments:

* `-p [password]` Your password
* `-o [output]` Output format. Supports: `json`, `env`, `docker`, `creds`
* `-f` If output is set to creds, force overwriting of default AWS credentials if they already exist

Output values:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_SESSION_TOKEN`

# Output Formats

ALKS will output in a variety of formats:

* `json`: Outputs a JSON object
* `env`: Outputs Bash/Windows environment variable string. You can wrap this call in an eval:  `eval $(alks keys create -o env)`
* `docker`: Outputs environment arguments to pass to a Docker run call
* `creds`: Updates the default AWS credentials file