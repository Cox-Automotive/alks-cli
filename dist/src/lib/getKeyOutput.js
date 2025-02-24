"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyOutput = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const moment_1 = tslib_1.__importDefault(require("moment"));
const isWindows_1 = require("./isWindows");
const updateCreds_1 = require("./updateCreds");
const log_1 = require("./log");
// if adding new output types be sure to update getOutputValues.ts
function getKeyOutput(format, key, profile, force) {
    const keyExpires = (0, moment_1.default)(key.expires).format();
    (0, log_1.log)(`using output format: ${format}`);
    switch (format) {
        case 'docker': {
            return `-e AWS_ACCESS_KEY_ID=${key.accessKey} -e AWS_SECRET_ACCESS_KEY=${key.secretKey} -e AWS_SESSION_TOKEN=${key.sessionToken} -e AWS_SESSION_EXPIRES=${keyExpires}`;
        }
        case 'terraformarg': {
            return `-e ALKS_ACCESS_KEY_ID=${key.accessKey} -e ALKS_SECRET_ACCESS_KEY=${key.secretKey} -e ALKS_SESSION_TOKEN=${key.sessionToken} -e ALKS_SESSION_EXPIRES=${keyExpires}`;
        }
        case 'tarraformenv': {
            const cmd = (0, isWindows_1.isWindows)() ? 'SET' : 'export';
            return `${cmd} ALKS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} ALKS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} ALKS_SESSION_TOKEN=${key.sessionToken} && ${cmd} ALKS_SESSION_EXPIRES=${keyExpires}`;
        }
        case 'json': {
            const keyData = {
                accessKey: key.accessKey,
                secretKey: key.secretKey,
                sessionToken: key.sessionToken,
                expires: key.expires, // This is the only format using the unformatted "key.expires". This may be a bug but I'm leaving it for the moment for backwards compatibility
            };
            return JSON.stringify(keyData, null, 4);
        }
        case 'creds': {
            if ((0, updateCreds_1.updateCreds)(key, profile, force)) {
                let msg = 'Your AWS credentials file has been updated';
                if (profile) {
                    msg += ` with the named profile: ${profile}`;
                }
                return msg;
            }
            else {
                return (0, cli_color_1.red)(`The ${profile} profile already exists in AWS credentials. Please pass -f to force overwrite.`);
            }
        }
        case 'idea': {
            return `AWS_ACCESS_KEY_ID=${key.accessKey}\nAWS_SECRET_ACCESS_KEY=${key.secretKey}\nAWS_SESSION_TOKEN=${key.sessionToken}\nAWS_SESSION_EXPIRES=${keyExpires}`;
        }
        case 'powershell': {
            return `$env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, $env:AWS_SESSION_TOKEN, $env:AWS_SESSION_EXPIRES = "${key.accessKey}","${key.secretKey}","${key.sessionToken}","${keyExpires}"`;
        }
        case 'fishshell': {
            return `set -xg AWS_ACCESS_KEY_ID '${key.accessKey}'; and set -xg AWS_SECRET_ACCESS_KEY '${key.secretKey}'; and set -xg AWS_SESSION_TOKEN '${key.sessionToken}'; and set -xg AWS_SESSION_EXPIRES '${keyExpires}';`;
        }
        case 'aws': {
            return JSON.stringify({
                Version: 1,
                AccessKeyId: key.accessKey,
                SecretAccessKey: key.secretKey,
                SessionToken: key.sessionToken,
                Expiration: (0, moment_1.default)(key.expires).toISOString(),
            });
        }
        case 'linux': {
            // forces export format
            return `export AWS_ACCESS_KEY_ID=${key.accessKey} && export AWS_SECRET_ACCESS_KEY=${key.secretKey} && export AWS_SESSION_TOKEN=${key.sessionToken} && export AWS_SESSION_EXPIRES=${keyExpires}`;
        }
        case 'export': // fall through to default case
        case 'set':
        default: {
            console.error('WARNING: Because this tool runs in a subshell, it cannot set environment variables in the parent shell. To use these keys, copy the commands printed below and run them in your current shell to have these environment variables set');
            const cmd = (0, isWindows_1.isWindows)() || format === 'set' ? 'SET' : 'export';
            return `${cmd} AWS_ACCESS_KEY_ID=${key.accessKey} && ${cmd} AWS_SECRET_ACCESS_KEY=${key.secretKey} && ${cmd} AWS_SESSION_TOKEN=${key.sessionToken} && ${cmd} AWS_SESSION_EXPIRES=${keyExpires}`;
        }
    }
}
exports.getKeyOutput = getKeyOutput;
//# sourceMappingURL=getKeyOutput.js.map