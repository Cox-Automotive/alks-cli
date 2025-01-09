"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForUpdate = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const npm_registry_fetch_1 = tslib_1.__importDefault(require("npm-registry-fetch"));
const semver_1 = require("semver");
const package_json_1 = require("../../package.json");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const log_1 = require("./log");
const showBorderedMessage_1 = require("./showBorderedMessage");
const lastVersion_1 = require("./state/lastVersion");
function getChangeLog() {
    const file = path_1.default.join(__dirname, '../../', 'changelog.txt');
    return fs_1.default.readFileSync(file, 'utf8');
}
function checkForUpdate() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const success = yield Promise.race([
            checkForUpdateInternal().then(() => true),
            // Force a timeout of 1 second
            new Promise((resolve) => {
                setTimeout(resolve.bind(null, false), 1000);
            }),
        ]);
        if (!success) {
            (0, log_1.log)('check for update timed out. Skipping...');
        }
    });
}
exports.checkForUpdate = checkForUpdate;
function checkForUpdateInternal() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('checking for update...');
        const currentVersion = package_json_1.version;
        const app = package_json_1.name;
        const response = yield (0, npm_registry_fetch_1.default)(`https://registry.npmjs.org/${app}/latest`, {
            timeout: 1000,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        const latestVersion = data.version;
        const needsUpdate = (0, semver_1.gt)(latestVersion, currentVersion);
        (0, log_1.log)('needs update? ' + (needsUpdate ? 'yes' : 'no'));
        if (needsUpdate) {
            const msg = [
                (0, cli_color_1.white)('Update available '),
                (0, cli_color_1.blue)(currentVersion),
                (0, cli_color_1.white)(' → '),
                (0, cli_color_1.green)(latestVersion + '\n'),
                (0, cli_color_1.white)('Run: '),
                (0, cli_color_1.green)('npm i -g ' + app),
                (0, cli_color_1.white)(' to update'),
            ].join('');
            (0, showBorderedMessage_1.showBorderedMessage)(40, msg);
        }
        else {
            const lastVersion = yield (0, lastVersion_1.getLastVersion)();
            // check if they just updated
            if ((0, semver_1.gt)(currentVersion, lastVersion)) {
                (0, log_1.log)('user updated, updating db with version');
                // give them release notes
                (0, showBorderedMessage_1.showBorderedMessage)(110, (0, cli_color_1.white)(getChangeLog()));
                // update the state to reflect that the last version run is the current version
                (0, log_1.log)('db');
                yield (0, lastVersion_1.setLastVersion)(currentVersion);
            }
        }
    });
}
//# sourceMappingURL=checkForUpdate.js.map