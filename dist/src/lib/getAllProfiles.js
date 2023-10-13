"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfiles = void 0;
const prop_ini_1 = require("prop-ini");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
const sensitive_1 = require("./sensitive");
// TODO: This could be refactored to repeatedly call getProfile() instead of duplicating the
// logic, although we would first need to break up the logic in getProfile() into smaller
// functions so that we're not performing tons of file I/O in this function
function getAllProfiles(includeNonAlksProfiles = false, showSensitiveValues = false) {
    const credFile = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
    const propIni = (0, prop_ini_1.createInstance)();
    const awsCreds = propIni.decode({ file: credFile });
    const sections = awsCreds.sections;
    const result = Object.entries(sections)
        .filter(([_name, section]) => includeNonAlksProfiles || section[awsCredentialsFileContstants_1.managedBy] === 'alks')
        .map(([name, section]) => ({
        name,
        [awsCredentialsFileContstants_1.accessKey]: section[awsCredentialsFileContstants_1.accessKey],
        [awsCredentialsFileContstants_1.secretKey]: showSensitiveValues
            ? section[awsCredentialsFileContstants_1.secretKey]
            : (0, sensitive_1.sensitive)(section[awsCredentialsFileContstants_1.secretKey]),
        [awsCredentialsFileContstants_1.sessionToken]: showSensitiveValues
            ? section[awsCredentialsFileContstants_1.sessionToken]
            : (0, sensitive_1.sensitive)(section[awsCredentialsFileContstants_1.sessionToken]),
        [awsCredentialsFileContstants_1.credentialProcess]: section[awsCredentialsFileContstants_1.credentialProcess],
        [awsCredentialsFileContstants_1.managedBy]: section[awsCredentialsFileContstants_1.managedBy],
    }));
    return result;
}
exports.getAllProfiles = getAllProfiles;
//# sourceMappingURL=getAllProfiles.js.map