"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePathInHome = void 0;
var path_1 = require("path");
function getFilePathInHome(filename) {
    return path_1.join(process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH || '', filename);
}
exports.getFilePathInHome = getFilePathInHome;
//# sourceMappingURL=getFilePathInHome.js.map