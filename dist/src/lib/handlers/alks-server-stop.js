"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerStop = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const isOsx_1 = require("../isOsx");
function handleAlksServerStop(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!(0, isOsx_1.isOsx)()) {
            console.error(cli_color_1.default.red('The metadata server is only supported on OSX.'));
            process.exit(0);
        }
        console.error(cli_color_1.default.white('Stopping metadata server..'));
        const forever = yield Promise.resolve().then(() => tslib_1.__importStar(require('forever')));
        forever.list(false, (_err, list) => {
            if (list === null) {
                console.log(cli_color_1.default.white('Metadata server is not running.'));
            }
            else {
                forever.stopAll();
                console.log(cli_color_1.default.white('Metadata server stopped.'));
            }
        });
    });
}
exports.handleAlksServerStop = handleAlksServerStop;
//# sourceMappingURL=alks-server-stop.js.map