"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgentString = void 0;
const package_json_1 = require("../../package.json");
function getUserAgentString() {
    return `alks-cli/${package_json_1.version}`;
}
exports.getUserAgentString = getUserAgentString;
//# sourceMappingURL=getUserAgentString.js.map