"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
function getProfile(profileName, hideSensitiveValues = true) {
    var _a, _b;
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
        [awsCredentialsFileContstants_1.secretKey]: hideSensitiveValues
            ? ((_a = profile[awsCredentialsFileContstants_1.secretKey]) === null || _a === void 0 ? void 0 : _a.substring(0, 4)) + '******'
            : profile[awsCredentialsFileContstants_1.secretKey],
        [awsCredentialsFileContstants_1.sessionToken]: hideSensitiveValues
            ? ((_b = profile[awsCredentialsFileContstants_1.sessionToken]) === null || _b === void 0 ? void 0 : _b.substring(0, 4)) + '******'
            : profile[awsCredentialsFileContstants_1.sessionToken],
        [awsCredentialsFileContstants_1.credentialProcess]: profile[awsCredentialsFileContstants_1.credentialProcess],
        [awsCredentialsFileContstants_1.managedBy]: profile[awsCredentialsFileContstants_1.managedBy],
    };
}
exports.getProfile = getProfile;
//# sourceMappingURL=getProfile.js.map