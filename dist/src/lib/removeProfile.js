"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProfile = void 0;
const prop_ini_1 = require("prop-ini");
const addNewLineToEof_1 = require("./addNewLineToEof");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
function removeProfile(profile, force = false) {
    const credFile = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
    const propIni = (0, prop_ini_1.createInstance)();
    propIni.decode({ file: credFile });
    const profileName = profile || 'default';
    const section = propIni.getData(profileName);
    if (!force && section[awsCredentialsFileContstants_1.managedBy] !== 'alks') {
        throw new Error('Profile is not managed by ALKS');
    }
    const success = propIni.removeData(profileName);
    if (!success) {
        throw new Error(`Failed to remove profile ${profileName}`);
    }
    propIni.encode({ file: credFile });
    // propIni doesnt add a new line, so running aws configure will cause issues
    (0, addNewLineToEof_1.addNewLineToEof)(credFile);
    return true;
}
exports.removeProfile = removeProfile;
//# sourceMappingURL=removeProfile.js.map