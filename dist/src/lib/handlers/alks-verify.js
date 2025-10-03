"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksVerify = void 0;
const tslib_1 = require("tslib");
const errorAndExit_1 = require("../errorAndExit");
function handleAlksVerify(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!options.changerequest) {
            (0, errorAndExit_1.errorAndExit)('The -r, --changerequest flag is required for verify mode.');
        }
        // ...actual verify logic here...
        console.log('Verify called with:', options);
    });
}
exports.handleAlksVerify = handleAlksVerify;
//# sourceMappingURL=alks-verify.js.map