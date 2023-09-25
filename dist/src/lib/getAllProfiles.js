"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfiles = void 0;
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
function getAllProfiles(includeNonAlksProfiles = false, hideSensitiveValues = true) {
    const credFile = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
    const propIni = (0, prop_ini_1.createInstance)();
    const awsCreds = propIni.decode({ file: credFile });
    const sections = awsCreds.sections;
    const result = Object.entries(sections)
        .filter(([_name, section]) => includeNonAlksProfiles || section[awsCredentialsFileContstants_1.managedBy] === 'alks')
        .map(([name, section]) => {
        var _a, _b;
        return ({
            name,
            [awsCredentialsFileContstants_1.accessKey]: section[awsCredentialsFileContstants_1.accessKey],
            [awsCredentialsFileContstants_1.secretKey]: hideSensitiveValues
                ? ((_a = section[awsCredentialsFileContstants_1.secretKey]) === null || _a === void 0 ? void 0 : _a.substring(0, 4)) + '******'
                : section[awsCredentialsFileContstants_1.secretKey],
            [awsCredentialsFileContstants_1.sessionToken]: hideSensitiveValues
                ? ((_b = section[awsCredentialsFileContstants_1.sessionToken]) === null || _b === void 0 ? void 0 : _b.substring(0, 4)) + '******'
                : section[awsCredentialsFileContstants_1.sessionToken],
            [awsCredentialsFileContstants_1.credentialProcess]: section[awsCredentialsFileContstants_1.credentialProcess],
            [awsCredentialsFileContstants_1.managedBy]: section[awsCredentialsFileContstants_1.managedBy],
        });
    });
    return result;
}
exports.getAllProfiles = getAllProfiles;
//# sourceMappingURL=getAllProfiles.js.map