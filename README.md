#ALKS CLI

## About
CLI for working with ALKS.

## Installing

ALKS CLI is meant to be installed via NPM.

    npm install alks -g

## Configuring

ALKS relies on a dotfile for its configuration. Copy *sample.env* to *alks.env* and save it in your home directory. Be sure to fill out all values in the file.

### Sample alks.env

```
ALKS_SERVER=https://server.alks
ALKS_USERID=mynetworkaccount
ALKS_ACCOUNT=mynetworkpassword
ALKS_ROLE=myrole
```

## Running

After installing ALKS it will be available on your path. Simply run the following to see a list of supported commands:

    alks

### Options

To see a what options are available to a command ask for help on it:

    alks keys help create