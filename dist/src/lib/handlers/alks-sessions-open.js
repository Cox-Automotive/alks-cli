"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsOpen = void 0;
const tslib_1 = require("tslib");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getIamKey_1 = require("../getIamKey");
const getKeyOutput_1 = require("../getKeyOutput");
const log_1 = require("../log");
const tryToExtractRole_1 = require("../tryToExtractRole");
const alksAccount_1 = require("../state/alksAccount");
const alksRole_1 = require("../state/alksRole");
const outputFormat_1 = require("../state/outputFormat");
function handleAlksSessionsOpen(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let alksAccount = options.account;
        let alksRole = options.role;
        // Try to guess role from account if only account was provided
        if (alksAccount && !alksRole) {
            (0, log_1.log)('trying to extract role from account');
            alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
        }
        // Validation for ChangeAPI options
        const hasCiid = options.ciid !== undefined && options.ciid !== null;
        const hasActivityType = options.activityType !== undefined && options.activityType !== null;
        const hasDescription = options.description !== undefined && options.description !== null;
        const hasChgNumber = !!options.chgNumber;
        if (hasChgNumber) {
            // If chg-number is provided, do not allow the other three
            if (hasCiid || hasActivityType || hasDescription) {
                (0, errorAndExit_1.errorAndExit)('Do not provide --ciid, --activity-type, or --description when using --chg-number.');
            }
        }
        else if (hasCiid || hasActivityType || hasDescription) {
            // If any of the three is provided, all must be present and non-empty (not just present)
            const ciidVal = typeof options.ciid === 'string' ? options.ciid.trim() : '';
            const activityTypeVal = typeof options.activityType === 'string'
                ? options.activityType.trim()
                : '';
            const descriptionVal = typeof options.description === 'string' ? options.description.trim() : '';
            if (!ciidVal || !activityTypeVal || !descriptionVal) {
                (0, errorAndExit_1.errorAndExit)('If any of --ciid, --activity-type, or --description is provided, all three must be specified and non-empty.');
            }
        }
        try {
            if (options.default) {
                alksAccount = yield (0, alksAccount_1.getAlksAccount)();
                alksRole = yield (0, alksRole_1.getAlksRole)();
                if (!alksAccount || !alksRole) {
                    (0, errorAndExit_1.errorAndExit)('Unable to load default account!');
                }
            }
            let changeRequestOptions;
            if (options.chgNumber) {
                changeRequestOptions = { changeNumber: options.chgNumber };
            }
            else {
                changeRequestOptions = {
                    ciid: options.ciid,
                    activityType: options.activityType,
                    description: options.description,
                };
            }
            const key = yield (0, getIamKey_1.getIamKey)(alksAccount, alksRole, options.newSession, options.favorites, !!options.iam, options.duration, changeRequestOptions);
            console.log((0, getKeyOutput_1.getKeyOutput)(options.output || (yield (0, outputFormat_1.getOutputFormat)()), key, (_a = options.profile) !== null && _a !== void 0 ? _a : options.namedProfile, options.force));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksSessionsOpen = handleAlksSessionsOpen;
//# sourceMappingURL=alks-sessions-open.js.map