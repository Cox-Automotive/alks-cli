"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamUpdateRole = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const log_1 = require("../log");
const unpackTags_1 = require("../unpackTags");
const extractAccountAndRole_1 = require("../extractAccountAndRole");
function handleAlksIamUpdateRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const roleName = options.rolename;
        if (!roleName) {
            (0, errorAndExit_1.errorAndExit)('Must provide a valid role name');
        }
        let trustPolicy;
        try {
            trustPolicy = options.trustPolicy
                ? JSON.parse(options.trustPolicy)
                : undefined;
        }
        catch (_a) {
            (0, errorAndExit_1.errorAndExit)('Error parsing trust policy. Must be valid JSON string');
        }
        const tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
        const { awsAccount, role } = yield (0, extractAccountAndRole_1.extractAccountAndRole)(options);
        try {
            const auth = yield (0, getAuth_1.getAuth)();
            (0, log_1.log)('calling api to update role: ' + roleName);
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            yield alks.updateRole({
                account: awsAccount.id,
                role,
                roleName,
                trustPolicy,
                tags,
            });
            console.log(cli_color_1.default.white(`The role "${roleName}" was updated successfully`));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksIamUpdateRole = handleAlksIamUpdateRole;
//# sourceMappingURL=alks-iam-updaterole.js.map