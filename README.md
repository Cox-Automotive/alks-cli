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

## Docker

If you would rather run the ALKS CLI as a Docker container, simply run the following:

```
docker run -it -v ~:/root coxauto/alks-cli
```