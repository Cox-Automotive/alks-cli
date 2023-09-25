"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksProfilesRemove = void 0;
const tslib_1 = require("tslib");
const getAllProfiles_1 = require("../getAllProfiles");
const removeProfile_1 = require("../removeProfile");
function handleAlksProfilesRemove(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (options.all) {
            const profiles = (0, getAllProfiles_1.getAllProfiles)();
            for (const profile of profiles) {
                console.error(`Removing profile: ${profile.name}`);
                (0, removeProfile_1.removeProfile)(profile.name, options.force);
            }
            console.error(`${profiles.length} profile${profiles.length === 1 ? '' : 's'} removed`);
        }
        else {
            if (!(options.profile || options.namedProfile)) {
                throw new Error('profile is required');
            }
            const profileName = (_a = options.profile) !== null && _a !== void 0 ? _a : options.namedProfile;
            // TODO prompt for confirmation
            (0, removeProfile_1.removeProfile)(profileName, options.force);
            console.error(`Profile ${profileName} removed`);
        }
    });
}
exports.handleAlksProfilesRemove = handleAlksProfilesRemove;
//# sourceMappingURL=alks-profiles-remove.js.map