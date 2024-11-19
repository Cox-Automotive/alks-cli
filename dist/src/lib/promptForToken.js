"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForToken = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const open_1 = tslib_1.__importDefault(require("open"));
const getAlks_1 = require("./getAlks");
const getPasswordFromPrompt_1 = require("./getPasswordFromPrompt");
const log_1 = require("./log");
const server_1 = require("./state/server");
function promptForToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Only pull up the token page if a token wasn't piped through STDIN
        if (process.stdin.isTTY) {
            const server = yield (0, server_1.getServer)();
            if (!server) {
                throw new Error('Server URL is not configured. Please run: alks developer configure');
            }
            console.error('Opening ALKS 2FA Page.. Be sure to login using Okta..');
            const url = server.replace(/rest/, 'token-management');
            console.error(`If the 2FA page does not open, please visit ${cli_color_1.default.underline(url)}`);
            try {
                yield Promise.race([
                    (0, open_1.default)(url, {
                        newInstance: true,
                    }),
                    new Promise((_, rej) => {
                        setTimeout(() => rej(), 5000);
                    }), // timeout after 5 seconds
                ]);
            }
            catch (err) {
                console.error(`Failed to open ${url}: ${err}`);
                console.error('Please open the url in the browser of your choice');
            }
            console.error('Please copy your refresh token from ALKS and paste below..');
        }
        const refreshToken = yield (0, getPasswordFromPrompt_1.getPasswordFromPrompt)('Refresh Token');
        (0, log_1.log)('exchanging refresh token for access token');
        const alks = yield (0, getAlks_1.getAlks)({});
        try {
            yield alks.getAccessToken({
                refreshToken,
            });
        }
        catch (err) {
            const e = err;
            e.message = 'Error validating refresh token. ' + e.message;
            throw err;
        }
        console.error(cli_color_1.default.white('Refresh token validated!'));
        return refreshToken;
    });
}
exports.promptForToken = promptForToken;
//# sourceMappingURL=promptForToken.js.map