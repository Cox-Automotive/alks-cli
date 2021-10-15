"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCreds = void 0;
var fs_1 = require("fs");
var getFilePathInHome_1 = require("./getFilePathInHome");
var prop_ini_1 = require("prop-ini");
var underscore_1 = require("underscore");
var addNewLineToEof_1 = require("./addNewLineToEof");
function updateCreds(key, profile, force) {
    var _a;
    var credPath = getFilePathInHome_1.getFilePathInHome('.aws');
    var credFile = credPath + '/credentials';
    // in case the user never ran `aws configure`..
    if (!fs_1.existsSync(credFile)) {
        if (!fs_1.existsSync(credPath)) {
            fs_1.mkdirSync(credPath);
        }
        fs_1.closeSync(fs_1.openSync(credFile, 'w'));
    }
    var propIni = prop_ini_1.createInstance();
    var awsCreds = propIni.decode({ file: credFile });
    var section = profile || 'default';
    var accessKey = 'aws_access_key_id';
    var secretKey = 'aws_secret_access_key';
    var sessToken = 'aws_session_token';
    if (underscore_1.has(awsCreds.sections, section)) {
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
        var data = (_a = {},
            _a[accessKey] = key.accessKey,
            _a[secretKey] = key.secretKey,
            _a[sessToken] = key.sessionToken,
            _a);
        propIni.addData(data, section);
    }
    propIni.encode({ file: credFile });
    // propIni doesnt add a new line, so running aws configure will cause issues
    addNewLineToEof_1.addNewLineToEof(credFile);
    return true;
}
exports.updateCreds = updateCreds;
//# sourceMappingURL=updateCreds.js.map