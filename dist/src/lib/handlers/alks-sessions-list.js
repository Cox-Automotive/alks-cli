"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsList = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const checkForUpdate_1 = require("../checkForUpdate");
const ensureConfigured_1 = require("../ensureConfigured");
const errorAndExit_1 = require("../errorAndExit");
const getAuth_1 = require("../getAuth");
const obfuscate_1 = require("../obfuscate");
const getKeys_1 = require("../getKeys");
const underscore_1 = require("underscore");
const log_1 = require("../log");
function handleAlksSessionsList(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, ensureConfigured_1.ensureConfigured)();
            (0, log_1.log)('getting auth');
            const auth = yield (0, getAuth_1.getAuth)();
            (0, log_1.log)('getting existing sesions');
            const nonIamKeys = yield (0, getKeys_1.getKeys)(auth, false);
            (0, log_1.log)('getting existing iam sesions');
            const iamKeys = yield (0, getKeys_1.getKeys)(auth, true);
            const foundKeys = [...nonIamKeys, ...iamKeys];
            const table = new cli_table3_1.default({
                head: [
                    cli_color_1.default.white.bold('Access Key'),
                    cli_color_1.default.white.bold('Secret Key'),
                    cli_color_1.default.white.bold('Type'),
                    cli_color_1.default.white.bold('Expires'),
                    cli_color_1.default.white.bold('Created'),
                ],
                colWidths: [25, 25, 10, 25, 25],
            });
            const groupedKeys = (0, underscore_1.groupBy)(foundKeys, 'alksAccount');
            (0, underscore_1.each)(groupedKeys, (keys, alksAccount) => {
                table.push([
                    {
                        colSpan: 4,
                        content: cli_color_1.default.yellow.bold('ALKS Account: ' + alksAccount),
                    },
                ]);
                (0, underscore_1.each)(keys, (keydata) => {
                    table.push([
                        (0, obfuscate_1.obfuscate)(keydata.accessKey),
                        (0, obfuscate_1.obfuscate)(keydata.secretKey),
                        keydata.isIAM ? 'IAM' : 'Standard',
                        (0, moment_1.default)(keydata.expires).calendar(),
                        (0, moment_1.default)(keydata.meta.created).fromNow(),
                    ]);
                });
            });
            if (!foundKeys.length) {
                table.push([
                    { colSpan: 5, content: cli_color_1.default.yellow.bold('No active sessions found.') },
                ]);
            }
            console.error(cli_color_1.default.white.underline.bold('Active Sessions'));
            console.log(cli_color_1.default.white(table.toString()));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksSessionsList = handleAlksSessionsList;
//# sourceMappingURL=alks-sessions-list.js.map