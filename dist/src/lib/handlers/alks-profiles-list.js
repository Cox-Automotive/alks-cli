"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksProfilesList = void 0;
const tslib_1 = require("tslib");
const getAllProfiles_1 = require("../getAllProfiles");
const cli_color_1 = require("cli-color");
function handleAlksProfilesList(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const profiles = (0, getAllProfiles_1.getAllProfiles)(options.all, options.showSensitiveValues);
        if (profiles.length === 0) {
            console.error((0, cli_color_1.red)('No profiles found'));
            return;
        }
        if (options.showSensitiveValues) {
            console.error('WARNING: Sensitive values will be shown in output. Do not share this output with anyone.');
        }
        switch (options.output) {
            case 'json': {
                console.log(JSON.stringify(profiles));
                break;
            }
            case 'list': {
                for (const profile of profiles) {
                    console.log(profile.name);
                }
                break;
            }
            default: {
                throw new Error('Invalid output type');
            }
        }
    });
}
exports.handleAlksProfilesList = handleAlksProfilesList;
//# sourceMappingURL=alks-profiles-list.js.map