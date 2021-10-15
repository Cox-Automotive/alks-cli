"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyOutput = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var moment_1 = tslib_1.__importDefault(require("moment"));
var isWindows_1 = require("./isWindows");
var updateCreds_1 = require("./updateCreds");
// if adding new output types be sure to update getOutputValues.ts
function getKeyOutput(format, key, profile, force) {
    var keyExpires = moment_1.default(key.expires).format();
    switch (format) {
        case 'docker': {
            return "-e AWS_ACCESS_KEY_ID=" + key.accessKey + " -e AWS_SECRET_ACCESS_KEY=" + key.secretKey + " -e AWS_SESSION_TOKEN=" + key.sessionToken + " -e AWS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'terraformarg': {
            return "-e ALKS_ACCESS_KEY_ID=" + key.accessKey + " -e ALKS_SECRET_ACCESS_KEY=" + key.secretKey + " -e ALKS_SESSION_TOKEN=" + key.sessionToken + " -e ALKS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'tarraformenv': {
            var cmd = isWindows_1.isWindows() ? 'SET' : 'export';
            return cmd + " ALKS_ACCESS_KEY_ID=" + key.accessKey + " && " + cmd + " ALKS_SECRET_ACCESS_KEY=" + key.secretKey + " && " + cmd + " ALKS_SESSION_TOKEN=" + key.sessionToken + " && " + cmd + " ALKS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'json': {
            var keyData = {
                accessKey: key.accessKey,
                secretKey: key.secretKey,
                sessionToken: key.sessionToken,
                expires: key.expires, // This is the only format using the unformatted "key.expires". This may be a bug but I'm leaving it for the moment for backwards compatibility
            };
            return JSON.stringify(keyData, null, 4);
        }
        case 'creds': {
            if (updateCreds_1.updateCreds(key, profile, force)) {
                var msg = 'Your AWS credentials file has been updated';
                if (profile) {
                    msg += " with the named profile: " + profile;
                }
                return msg;
            }
            else {
                return cli_color_1.red("The " + profile + " profile already exists in AWS credentials. Please pass -f to force overwrite.");
            }
        }
        case 'idea': {
            return "AWS_ACCESS_KEY_ID=" + key.accessKey + "\nAWS_SECRET_ACCESS_KEY=" + key.secretKey + "\nAWS_SESSION_TOKEN=" + key.sessionToken + "\nAWS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'powershell': {
            return "$env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, $env:AWS_SESSION_TOKEN, $env:AWS_SESSION_EXPIRES = \"" + key.accessKey + "\",\"" + key.secretKey + "\",\"" + key.sessionToken + "\",\"" + keyExpires + "\"";
        }
        case 'fishshell': {
            return "set -xg AWS_ACCESS_KEY_ID '" + key.accessKey + "'; and set -xg AWS_SECRET_ACCESS_KEY '" + key.secretKey + "'; and set -xg AWS_SESSION_TOKEN '" + key.sessionToken + "'; and set -xg AWS_SESSION_EXPIRES '" + keyExpires + "';";
        }
        case 'aws': {
            return JSON.stringify({
                Version: 1,
                AccessKeyId: key.accessKey,
                SecretAccessKey: key.secretKey,
                SessionToken: key.sessionToken,
                Expiration: moment_1.default(key.expires).toISOString(),
            });
        }
        case 'export': // fall through to default case
        case 'set':
        default: {
            var cmd = isWindows_1.isWindows() || format === 'set' ? 'SET' : 'export';
            return cmd + " AWS_ACCESS_KEY_ID=" + key.accessKey + " && " + cmd + " AWS_SECRET_ACCESS_KEY=" + key.secretKey + " && " + cmd + " AWS_SESSION_TOKEN=" + key.sessionToken + " && " + cmd + " AWS_SESSION_EXPIRES=" + keyExpires;
        }
    }
}
exports.getKeyOutput = getKeyOutput;
//# sourceMappingURL=getKeyOutput.js.map