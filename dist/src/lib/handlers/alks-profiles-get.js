"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksProfilesGet = void 0;
const tslib_1 = require("tslib");
const getProfile_1 = require("../getProfile");
function handleAlksProfilesGet(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!(options.profile || options.namedProfile)) {
            throw new Error('profile is required');
        }
        if (options.showSensitiveValues) {
            console.error('WARNING: Sensitive values will be shown in output. Do not share this output with anyone.');
        }
        const profileName = (_a = options.profile) !== null && _a !== void 0 ? _a : options.namedProfile;
        const profile = (0, getProfile_1.getProfile)(profileName, options.showSensitiveValues);
        if (!profile) {
            throw new Error(`Profile ${profileName} does not exist`);
        }
        switch (options.output) {
            case 'json': {
                console.log(JSON.stringify(profile));
                break;
            }
            case 'text': {
                console.log(`[${profile.name}]`);
                for (const [key, value] of Object.entries(profile)) {
                    if (key === 'name') {
                        continue;
                    }
                    console.log(`${key}=${value}`);
                }
                break;
            }
            default: {
                throw new Error('Invalid output type');
            }
        }
    });
}
exports.handleAlksProfilesGet = handleAlksProfilesGet;
//# sourceMappingURL=alks-profiles-get.js.map