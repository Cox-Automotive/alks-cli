"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallerInfo = void 0;
function getCallerInfo() {
    const error = new Error();
    const stack = error.stack.split('\n');
    const stackLine = stack.length < 4 ? stack.pop() : stack[3];
    const parts = stackLine.trim().slice(3).split(' ');
    const info = [
        parts[0],
        ...parts[parts.length - 1].replace(/\(|\)/g, '').split(':'),
    ];
    const fileComponents = info[1].split('/');
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