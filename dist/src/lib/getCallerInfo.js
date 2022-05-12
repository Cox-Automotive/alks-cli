"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallerInfo = void 0;
var tslib_1 = require("tslib");
function getCallerInfo() {
    var error = new Error();
    var stack = error.stack.split('\n');
    var stackLine = stack.length < 4 ? stack.pop() : stack[3];
    var parts = stackLine.trim().slice(3).split(' ');
    var info = tslib_1.__spreadArray([
        parts[0]
    ], parts[parts.length - 1].replace(/\(|\)/g, '').split(':'), true);
    var fileComponents = info[1].split('/');
    return {
        func: info[0],
        fileName: fileComponents[fileComponents.length - 1],
        filePath: fileComponents.slice(0, fileComponents.length - 1).join('/'),
        line: Number(info[2]),
        char: Number(info[3]),
    };
}
exports.getCallerInfo = getCallerInfo;
//# sourceMappingURL=getCallerInfo.js.map