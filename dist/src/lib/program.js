"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
var tslib_1 = require("tslib");
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = require("../../package.json");
exports.program = commander_1.default
    .version(package_json_1.version)
    .option('-v, --verbose', 'be verbose');
//# sourceMappingURL=program.js.map