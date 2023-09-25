"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
function getProfile(profileName) {
    const credFile = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
    const propIni = (0, prop_ini_1.createInstance)();
    propIni.decode({ file: credFile });
    const profile = propIni.getData(profileName);
    if (!profile) {
        return undefined;
    }
    return {
        name: profileName,
        [awsCredentialsFileContstants_1.accessKey]: profile[awsCredentialsFileContstants_1.accessKey],
        [awsCredentialsFileContstants_1.secretKey]: profile[awsCredentialsFileContstants_1.secretKey],
        [awsCredentialsFileContstants_1.sessionToken]: profile[awsCredentialsFileContstants_1.sessionToken],
        [awsCredentialsFileContstants_1.credentialProcess]: profile[awsCredentialsFileContstants_1.credentialProcess],
        [awsCredentialsFileContstants_1.managedBy]: profile[awsCredentialsFileContstants_1.managedBy],
    };
}
exports.getProfile = getProfile;
//# sourceMappingURL=getProfile.js.map