"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCreds = void 0;
const fs_1 = require("fs");
const getFilePathInHome_1 = require("./getFilePathInHome");
const prop_ini_1 = require("prop-ini");
const underscore_1 = require("underscore");
const addNewLineToEof_1 = require("./addNewLineToEof");
function updateCreds(key, profile, force) {
    const credPath = (0, getFilePathInHome_1.getFilePathInHome)('.aws');
    const credFile = credPath + '/credentials';
    // in case the user never ran `aws configure`..
    if (!(0, fs_1.existsSync)(credFile)) {
        if (!(0, fs_1.existsSync)(credPath)) {
            (0, fs_1.mkdirSync)(credPath);
        }
        (0, fs_1.closeSync)((0, fs_1.openSync)(credFile, 'w'));
    }
    const propIni = (0, prop_ini_1.createInstance)();
    const awsCreds = propIni.decode({ file: credFile });
    const section = profile || 'default';
    const accessKey = 'aws_access_key_id';
    const secretKey = 'aws_secret_access_key';
    const sessToken = 'aws_session_token';
    if ((0, underscore_1.has)(awsCreds.sections, section)) {
        if (force) {
            // overwrite only the relevant keys and leave the rest of the section untouched
            propIni.addData(key.accessKey, section, accessKey);
            propIni.addData(key.secretKey, section, secretKey);
            propIni.addData(key.sessionToken, section, sessToken);
        }
        else {
            return false;
        }
    }
    else {
        // add brand new section
        const data = {
            [accessKey]: key.accessKey,
            [secretKey]: key.secretKey,
            [sessToken]: key.sessionToken,
        };
        propIni.addData(data, section);
    }
    propIni.encode({ file: credFile });
    // propIni doesnt add a new line, so running aws configure will cause issues
    (0, addNewLineToEof_1.addNewLineToEof)(credFile);
    return true;
}
exports.updateCreds = updateCreds;
//# sourceMappingURL=generateProfile.js.map