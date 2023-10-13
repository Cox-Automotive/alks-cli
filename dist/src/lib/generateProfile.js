"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProfile = void 0;
const prop_ini_1 = require("prop-ini");
const underscore_1 = require("underscore");
const addNewLineToEof_1 = require("./addNewLineToEof");
const getAwsCredentialsFile_1 = require("./getAwsCredentialsFile");
const awsCredentialsFileContstants_1 = require("./awsCredentialsFileContstants");
function generateProfile(accountId, role, profile, force = false) {
    const credFile = (0, getAwsCredentialsFile_1.getAwsCredentialsFile)();
    const propIni = (0, prop_ini_1.createInstance)();
    const awsCreds = propIni.decode({ file: credFile });
    const section = profile || 'default';
    const credentialProcessCommand = `alks sessions open -a ${accountId} -r ${role} -o aws`;
    if ((0, underscore_1.has)(awsCreds.sections, section)) {
        if (force) {
            // overwrite only the relevant keys and leave the rest of the section untouched
            propIni.addData(credentialProcessCommand, section, awsCredentialsFileContstants_1.credentialProcess);
            propIni.removeData(section, awsCredentialsFileContstants_1.accessKey);
            propIni.removeData(section, awsCredentialsFileContstants_1.secretKey);
            propIni.removeData(section, awsCredentialsFileContstants_1.sessionToken);
            propIni.addData('alks', section, awsCredentialsFileContstants_1.managedBy);
        }
        else {
            throw new Error(`Profile ${section} already exists. Use --force to overwrite.`);
        }
    }
    else {
        // add brand new section
        const data = {
            [awsCredentialsFileContstants_1.credentialProcess]: credentialProcessCommand,
            [awsCredentialsFileContstants_1.managedBy]: 'alks',
        };
        propIni.addData(data, section);
    }
    propIni.encode({ file: credFile });
    // propIni doesnt add a new line, so running aws configure will cause issues
    (0, addNewLineToEof_1.addNewLineToEof)(credFile);
}
exports.generateProfile = generateProfile;
//# sourceMappingURL=generateProfile.js.map