"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksProfilesRemove = void 0;
const tslib_1 = require("tslib");
const getAllProfiles_1 = require("../getAllProfiles");
const removeProfile_1 = require("../removeProfile");
const confirm_1 = require("../confirm");
function handleAlksProfilesRemove(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (options.all) {
            const profiles = (0, getAllProfiles_1.getAllProfiles)();
            if (options.force ||
                (yield (0, confirm_1.confirm)(`Are you sure you want to remove ${profiles.length} profiles?`))) {
                for (const profile of profiles) {
                    console.error(`Removing profile: ${profile.name}`);
                    (0, removeProfile_1.removeProfile)(profile.name, options.force);
                }
                console.error(`${profiles.length} profile${profiles.length === 1 ? '' : 's'} removed`);
            }
            else {
                throw new Error('Aborting');
            }
        }
        else {
            if (!(options.profile || options.namedProfile)) {
                throw new Error('profile is required');
            }
            const profileName = (_a = options.profile) !== null && _a !== void 0 ? _a : options.namedProfile;
            if (options.force ||
                (yield (0, confirm_1.confirm)(`Are you sure you want to remove ${profileName}?`))) {
                (0, removeProfile_1.removeProfile)(profileName, options.force);
                console.error(`Profile ${profileName} removed`);
            }
            else {
                throw new Error('Aborting');
            }
        }
    });
}
exports.handleAlksProfilesRemove = handleAlksProfilesRemove;
//# sourceMappingURL=alks-profiles-remove.js.map