"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerStop = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var isOsx_1 = require("../isOsx");
function handleAlksServerStop(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var forever;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isOsx_1.isOsx()) {
                        console.error(cli_color_1.default.red('The metadata server is only supported on OSX.'));
                        process.exit(0);
                    }
                    console.error(cli_color_1.default.white('Stopping metadata server..'));
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('forever')); })];
                case 1:
                    forever = _a.sent();
                    forever.list(false, function (_err, list) {
                        if (list === null) {
                            console.log(cli_color_1.default.white('Metadata server is not running.'));
                        }
                        else {
                            forever.stopAll();
                            console.log(cli_color_1.default.white('Metadata server stopped.'));
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksServerStop = handleAlksServerStop;
//# sourceMappingURL=alks-server-stop.js.map