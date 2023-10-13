"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAwsCredentialsFile = void 0;
const fs_1 = require("fs");
const getFilePathInHome_1 = require("./getFilePathInHome");
function getAwsCredentialsFile() {
    const credPath = (0, getFilePathInHome_1.getFilePathInHome)('.aws');
    const credFile = credPath + '/credentials';
    // in case the user never ran `aws configure`..
    if (!(0, fs_1.existsSync)(credFile)) {
        if (!(0, fs_1.existsSync)(credPath)) {
            (0, fs_1.mkdirSync)(credPath);
        }
        (0, fs_1.closeSync)((0, fs_1.openSync)(credFile, 'w'));
    }
    return credFile;
}
exports.getAwsCredentialsFile = getAwsCredentialsFile;
//# sourceMappingURL=getAwsCredentialsFile.js.map