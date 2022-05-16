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
    var keyExpires = (0, moment_1.default)(key.expires).format();
    switch (format) {
        case 'docker': {
            return "-e AWS_ACCESS_KEY_ID=".concat(key.accessKey, " -e AWS_SECRET_ACCESS_KEY=").concat(key.secretKey, " -e AWS_SESSION_TOKEN=").concat(key.sessionToken, " -e AWS_SESSION_EXPIRES=").concat(keyExpires);
        }
        case 'terraformarg': {
            return "-e ALKS_ACCESS_KEY_ID=".concat(key.accessKey, " -e ALKS_SECRET_ACCESS_KEY=").concat(key.secretKey, " -e ALKS_SESSION_TOKEN=").concat(key.sessionToken, " -e ALKS_SESSION_EXPIRES=").concat(keyExpires);
        }
        case 'tarraformenv': {
            var cmd = (0, isWindows_1.isWindows)() ? 'SET' : 'export';
            return "".concat(cmd, " ALKS_ACCESS_KEY_ID=").concat(key.accessKey, " && ").concat(cmd, " ALKS_SECRET_ACCESS_KEY=").concat(key.secretKey, " && ").concat(cmd, " ALKS_SESSION_TOKEN=").concat(key.sessionToken, " && ").concat(cmd, " ALKS_SESSION_EXPIRES=").concat(keyExpires);
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
            if ((0, updateCreds_1.updateCreds)(key, profile, force)) {
                var msg = 'Your AWS credentials file has been updated';
                if (profile) {
                    msg += " with the named profile: ".concat(profile);
                }
                return msg;
            }
            else {
                return (0, cli_color_1.red)("The ".concat(profile, " profile already exists in AWS credentials. Please pass -f to force overwrite."));
            }
        }
        case 'idea': {
            return "AWS_ACCESS_KEY_ID=".concat(key.accessKey, "\nAWS_SECRET_ACCESS_KEY=").concat(key.secretKey, "\nAWS_SESSION_TOKEN=").concat(key.sessionToken, "\nAWS_SESSION_EXPIRES=").concat(keyExpires);
        }
        case 'powershell': {
            return "$env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, $env:AWS_SESSION_TOKEN, $env:AWS_SESSION_EXPIRES = \"".concat(key.accessKey, "\",\"").concat(key.secretKey, "\",\"").concat(key.sessionToken, "\",\"").concat(keyExpires, "\"");
        }
        case 'fishshell': {
            return "set -xg AWS_ACCESS_KEY_ID '".concat(key.accessKey, "'; and set -xg AWS_SECRET_ACCESS_KEY '").concat(key.secretKey, "'; and set -xg AWS_SESSION_TOKEN '").concat(key.sessionToken, "'; and set -xg AWS_SESSION_EXPIRES '").concat(keyExpires, "';");
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
        case 'export': // fall through to default case
        case 'set':
        default: {
            var cmd = (0, isWindows_1.isWindows)() || format === 'set' ? 'SET' : 'export';
            return "".concat(cmd, " AWS_ACCESS_KEY_ID=").concat(key.accessKey, " && ").concat(cmd, " AWS_SECRET_ACCESS_KEY=").concat(key.secretKey, " && ").concat(cmd, " AWS_SESSION_TOKEN=").concat(key.sessionToken, " && ").concat(cmd, " AWS_SESSION_EXPIRES=").concat(keyExpires);
        }
    }
}
exports.getKeyOutput = getKeyOutput;
//# sourceMappingURL=getKeyOutput.js.map