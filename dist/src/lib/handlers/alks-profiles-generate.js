"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksProfilesGenerate = void 0;
const tslib_1 = require("tslib");
const generateProfile_1 = require("../generateProfile");
const getAlksAccounts_1 = require("../getAlksAccounts");
const cli_color_1 = require("cli-color");
function handleAlksProfilesGenerate(options) {
    var _a, _b, _c;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (options.all) {
            // Generate profiles for all account/role pairs
            const accounts = yield (0, getAlksAccounts_1.getAlksAccounts)();
            let profilesGenerated = 0;
            for (const account of accounts) {
                const accountName = (_b = (_a = account.skypieaAccount) === null || _a === void 0 ? void 0 : _a.alias) !== null && _b !== void 0 ? _b : account.account.substring(0, 12);
                try {
                    (0, generateProfile_1.generateProfile)(accountName, account.role, `${accountName}-${account.role}`, options.force);
                    profilesGenerated++;
                }
                catch (err) {
                    console.error((0, cli_color_1.red)(`Error generating profile for ${accountName}-${account.role}: ${err}`));
                }
            }
            console.error(`${profilesGenerated} profile${profilesGenerated == 1 ? '' : 's'} generated`);
        }
        else if (options.account) {
            // Generate a single profile
            if (!options.role) {
                throw new Error('role is required');
            }
            const profileName = (_c = options.profile) !== null && _c !== void 0 ? _c : options.namedProfile;
            (0, generateProfile_1.generateProfile)(options.account, options.role, profileName, options.force);
            console.error(`Profile ${profileName} generated`);
        }
        else {
            throw new Error('Either --all or --account and --role is required at a minimum');
        }
    });
}
exports.handleAlksProfilesGenerate = handleAlksProfilesGenerate;
//# sourceMappingURL=alks-profiles-generate.js.map