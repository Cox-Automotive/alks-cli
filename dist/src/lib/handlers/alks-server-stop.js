"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerStop = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var isOsx_1 = require("../isOsx");
var forever_1 = tslib_1.__importDefault(require("forever"));
function handleAlksServerStop(_) {
    if (!isOsx_1.isOsx()) {
        console.error(cli_color_1.default.red('The metadata server is only supported on OSX.'));
        process.exit(0);
    }
    console.error(cli_color_1.default.white('Stopping metadata server..'));
    forever_1.default.list(false, function (_err, list) {
        if (list === null) {
            console.log(cli_color_1.default.white('Metadata server is not running.'));
        }
        else {
            forever_1.default.stopAll();
            console.log(cli_color_1.default.white('Metadata server stopped.'));
        }
    });
}
exports.handleAlksServerStop = handleAlksServerStop;
//# sourceMappingURL=alks-server-stop.js.map