"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgentString = void 0;
var package_json_1 = require("../../package.json");
function getUserAgentString() {
    return "alks-cli/".concat(package_json_1.version);
}
exports.getUserAgentString = getUserAgentString;
//# sourceMappingURL=getUserAgentString.js.map