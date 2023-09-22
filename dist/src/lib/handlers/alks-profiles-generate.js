"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksProfilesGenerate = void 0;
const tslib_1 = require("tslib");
const generateProfile_1 = require("../generateProfile");
function handleAlksProfilesGenerate(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (options.all) {
            // Generate profiles for all account/role pairs
            throw new Error('Not implemented');
        }
        else if (options.account) {
            // Generate a single profile
            if (!options.role) {
                throw new Error('role is required');
            }
            (0, generateProfile_1.generateProfile)(options.account, options.role, (_a = options.profile) !== null && _a !== void 0 ? _a : options.namedProfile, options.force);
        }
        else {
            throw new Error('Either --all or --account is required at a minimum');
        }
    });
}
exports.handleAlksProfilesGenerate = handleAlksProfilesGenerate;
//# sourceMappingURL=alks-profiles-generate.js.map