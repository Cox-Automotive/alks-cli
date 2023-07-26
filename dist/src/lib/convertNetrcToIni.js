"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNetrcToIni = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const { access, rm, readFile } = fs_1.promises;
const path_1 = require("path");
const os_1 = require("os");
const credentials_1 = require("./state/credentials");
const node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
const log_1 = require("./log");
const credentials_2 = require("./state/credentials");
const NETRC_FILE_PATH = (0, path_1.join)((0, os_1.homedir)(), '.netrc');
const NETRC_ALKS_PASSWORD = 'alkscli';
const NETRC_ALKS_TOKEN = 'alksclitoken';
function convertNetrcToIni() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('checking if netrc file exists');
        try {
            const netrcFileExists = yield access(NETRC_FILE_PATH)
                .then(() => true)
                .catch(() => false);
            const credentialsFileExists = yield access((0, credentials_2.getCredentialsFilePath)())
                .then(() => true)
                .catch(() => false);
            // If credentials file hasn't been created yet but .netrc has, populate data from .netrc
            if (netrcFileExists && !credentialsFileExists) {
                (0, log_1.log)('converting netrc file to credentials file');
                const credentials = yield (0, credentials_1.getCredentials)();
                const passwordAuth = (0, node_netrc_1.default)(NETRC_ALKS_PASSWORD);
                if (passwordAuth.password) {
                    (0, log_1.log)('converting password auth');
                    credentials.password = passwordAuth.password;
                    // remove the alks password from the netrc file
                    node_netrc_1.default.update(NETRC_ALKS_PASSWORD);
                }
                const tokenAuth = (0, node_netrc_1.default)(NETRC_ALKS_TOKEN);
                if (tokenAuth.password) {
                    (0, log_1.log)('converting token auth');
                    credentials.refresh_token = tokenAuth.password;
                    // remove the alks token from the netrc file
                    node_netrc_1.default.update(NETRC_ALKS_PASSWORD);
                }
                (0, log_1.log)('writing credentials file');
                yield (0, credentials_1.setCredentials)(credentials);
                // remove the old .netrc file for security reasons if all it had was ALKS info
                if (netrcFileExists) {
                    const netrcData = yield readFile(NETRC_FILE_PATH, 'utf-8');
                    if (netrcData.trim().length === 0) {
                        (0, log_1.log)('removing netrc file');
                        yield rm(NETRC_FILE_PATH);
                    }
                }
            }
        }
        catch (e) {
            // If the conversion fails, just pretend like the netrc file doesn't exist and continue anyway
            (0, log_1.log)('failed to convert netrc file to ini file: ' + e);
        }
    });
}
exports.convertNetrcToIni = convertNetrcToIni;
//# sourceMappingURL=convertNetrcToIni.js.map