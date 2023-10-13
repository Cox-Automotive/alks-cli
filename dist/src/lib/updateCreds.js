"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCreds = void 0;
const prop_ini_1 = require("prop-ini");
const underscore_1 = require("underscore");
const addNewLineToEof_1 = require("./addNewLineToEof");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
function updateCreds(key, profile, force = false) {
    const credFile = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
    const propIni = (0, prop_ini_1.createInstance)();
    const awsCreds = propIni.decode({ file: credFile });
    const section = profile || 'default';
    if ((0, underscore_1.has)(awsCreds.sections, section)) {
        if (force) {
            // overwrite only the relevant keys and leave the rest of the section untouched
            propIni.removeData(section, awsCredentialsFileContstants_1.credentialProcess);
            propIni.addData(key.accessKey, section, awsCredentialsFileContstants_1.accessKey);
            propIni.addData(key.secretKey, section, awsCredentialsFileContstants_1.secretKey);
            propIni.addData(key.sessionToken, section, awsCredentialsFileContstants_1.sessionToken);
            propIni.addData('alks', section, awsCredentialsFileContstants_1.managedBy);
        }
        else {
            return false;
        }
    }
    else {
        // add brand new section
        const data = {
            [awsCredentialsFileContstants_1.accessKey]: key.accessKey,
            [awsCredentialsFileContstants_1.secretKey]: key.secretKey,
            [awsCredentialsFileContstants_1.sessionToken]: key.sessionToken,
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        };
        propIni.addData(data, section);
    }
    propIni.encode({ file: credFile });
    // propIni doesnt add a new line, so running aws configure will cause issues
    (0, addNewLineToEof_1.addNewLineToEof)(credFile);
    return true;
}
exports.updateCreds = updateCreds;
//# sourceMappingURL=updateCreds.js.map