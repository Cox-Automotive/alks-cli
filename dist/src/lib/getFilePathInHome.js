"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePathInHome = void 0;
var path_1 = require("path");
var os_1 = require("os");
function getFilePathInHome(filename) {
    return (0, path_1.join)((0, os_1.homedir)(), filename);
}
exports.getFilePathInHome = getFilePathInHome;
//# sourceMappingURL=getFilePathInHome.js.map