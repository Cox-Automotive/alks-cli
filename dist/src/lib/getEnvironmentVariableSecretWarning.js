"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentVariableSecretWarning = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
function getEnvironmentVariableSecretWarning(varName) {
    return cli_color_1.default.red(`WARNING: Using the ${varName} environment variable is not recommended since other applications may accidentally log it. Proceed with caution.`);
}
exports.getEnvironmentVariableSecretWarning = getEnvironmentVariableSecretWarning;
//# sourceMappingURL=getEnvironmentVariableSecretWarning.js.map