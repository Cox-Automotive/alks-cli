"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksCreate = void 0;
const tslib_1 = require("tslib");
const errorAndExit_1 = require("../errorAndExit");
function handleAlksCreate(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!options.ciid || !options.description || !options.activitytype) {
            (0, errorAndExit_1.errorAndExit)('All of -c, --ciid, --description, and --activitytype are required for create mode.');
        }
        // ...actual create logic here...
        console.log('Create called with:', options);
    });
}
exports.handleAlksCreate = handleAlksCreate;
//# sourceMappingURL=alks-create.js.map