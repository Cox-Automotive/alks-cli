"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamRoleTypes = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const underscore_1 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const log_1 = require("../log");
const getOutputValues_1 = require("../getOutputValues");
function handleAlksIamRoleTypes(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const outputVals = (0, getOutputValues_1.getOutputValuesRoleTypes)();
        const output = options.output;
        if (!(0, underscore_1.contains)(outputVals, output)) {
            (0, errorAndExit_1.errorAndExit)('The output provided (' +
                output +
                ') is not in the allowed values: ' +
                outputVals.join(', '));
        }
        try {
            (0, log_1.log)('getting auth');
            const auth = yield (0, getAuth_1.getAuth)();
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            (0, log_1.log)('getting list of role types from REST API');
            let roleTypes;
            try {
                roleTypes = yield alks.getAllAWSRoleTypes({});
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            (0, log_1.log)('outputting list of ' +
                (roleTypes ? roleTypes.length : -1) +
                ' role types');
            console.error(cli_color_1.default.white.underline.bold('\nAvailable IAM Role Types'));
            if (output === 'list') {
                for (const [index, roleType] of roleTypes.entries()) {
                    console.log(cli_color_1.default.white(`${String(index).padStart(2, ' ')}) ${roleType.roleTypeName}`));
                }
            }
            else {
                console.log(JSON.stringify(roleTypes.map((roleType) => roleType.roleTypeName)));
            }
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksIamRoleTypes = handleAlksIamRoleTypes;
//# sourceMappingURL=alks-iam-roletypes.js.map