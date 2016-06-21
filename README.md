#ALKS CLI

## About
CLI for working with ALKS.

## Installing

ALKS CLI is meant to be installed via NPM.

    npm install alks -g

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