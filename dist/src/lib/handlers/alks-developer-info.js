"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperInfo = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const log_1 = require("../log");
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
const underscore_1 = require("underscore");
const password_1 = require("../state/password");
const token_1 = require("../state/token");
const developer_1 = require("../state/developer");
function handleAlksDeveloperInfo(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const table = new cli_table3_1.default({
            head: [cli_color_1.default.white.bold('Key'), cli_color_1.default.white.bold('Value')],
            colWidths: [25, 50],
        });
        try {
            (0, log_1.log)('getting developer');
            const developer = yield (0, developer_1.getDeveloper)();
            (0, log_1.log)('getting password');
            const password = yield (0, password_1.getPassword)();
            (0, log_1.log)('getting 2fa token');
            const token = yield (0, token_1.getToken)();
            const mapping = {
                server: 'ALKS Server',
                userid: 'Network Login',
                alksAccount: 'Default ALKS Account',
                alksRole: 'Default ALKS Role',
                outputFormat: 'Default Output Format',
            };
            for (const [key, label] of Object.entries(mapping)) {
                const value = developer[key];
                table.push([label, (0, underscore_1.isEmpty)(value) ? '' : value]);
            }
            const tablePassword = !(0, underscore_1.isEmpty)(password)
                ? '**********'
                : cli_color_1.default.red('NOT SET');
            table.push(['Password', tablePassword]);
            const tableToken = !(0, underscore_1.isEmpty)(token)
                ? token.substring(0, 4) + '**********'
                : cli_color_1.default.red('NOT SET');
            table.push(['2FA Token', tableToken]);
            console.error(cli_color_1.default.white.underline.bold('\nDeveloper Configuration'));
            console.log(cli_color_1.default.white(table.toString()));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksDeveloperInfo = handleAlksDeveloperInfo;
//# sourceMappingURL=alks-developer-info.js.map