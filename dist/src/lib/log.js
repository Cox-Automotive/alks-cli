"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogs = exports.log = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const getCallerInfo_1 = require("./getCallerInfo");
const program_1 = tslib_1.__importDefault(require("./program"));
const fs_1 = require("fs");
const folders_1 = require("./folders");
const path_1 = require("path");
const { mkdir, appendFile, stat, unlink } = fs_1.promises;
const defaultLogFileName = 'alks.log';
function log(msg, opts = {}) {
    let prefix = opts.prefix;
    if (!prefix) {
        const caller = (0, getCallerInfo_1.getCallerInfo)();
        prefix = `${caller.fileName}:${caller.line}:${caller.char}`;
    }
    const verbose = opts.verbose === undefined
        ? program_1.default.opts().verbose || program_1.default.opts().unsafeVerbose
        : opts.verbose;
    if (opts.unsafe && !program_1.default.opts().unsafeVerbose) {
        if (opts.alt) {
            msg = opts.alt;
        }
        else {
            // Don't log anything
            return;
        }
    }
    if (verbose) {
        console.error((0, cli_color_1.yellow)(`[${prefix}]: ${msg}`));
    }
    writeLogToFile(msg, Object.assign(Object.assign({}, opts), { prefix }));
}
exports.log = log;
function initLogs(filename) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!filename) {
            filename = defaultLogFileName;
        }
        try {
            const { birthtime } = yield stat((0, path_1.join)((0, folders_1.getAlksLogFolder)(), filename));
            if (birthtime) {
                // if the file is older than 7 days, clear the old file
                if (Date.now() - birthtime.getTime() > 1000 * 60 * 60 * 24 * 7) {
                    yield unlink((0, path_1.join)((0, folders_1.getAlksLogFolder)(), filename));
                }
            }
        }
        catch (err) {
            // do nothing
        }
        // ensure the alks log folder exists
        yield mkdir((0, folders_1.getAlksLogFolder)()).catch((err) => {
            if (err.message.includes('EEXIST')) {
            }
            else {
                throw err;
            }
        });
        yield appendFile((0, path_1.join)((0, folders_1.getAlksLogFolder)(), filename), `--- ${process.argv.join(' ')} ---\n`);
    });
}
exports.initLogs = initLogs;
function writeLogToFile(data, opts) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const filename = (_a = opts === null || opts === void 0 ? void 0 : opts.filename) !== null && _a !== void 0 ? _a : defaultLogFileName;
        const logFile = (0, path_1.join)((0, folders_1.getAlksLogFolder)(), filename);
        const time = new Date().toISOString();
        // Omit writing unsafe data to log file
        if (opts === null || opts === void 0 ? void 0 : opts.unsafe) {
            if (opts === null || opts === void 0 ? void 0 : opts.alt) {
                data = opts.alt;
            }
            else {
                // Don't write anything
                return;
            }
        }
        const prefix = (opts === null || opts === void 0 ? void 0 : opts.prefix) ? `[${opts.prefix}] ` : '';
        try {
            yield appendFile(logFile, `${time} - ${prefix}${data}\n`);
        }
        catch (err) {
            // do nothing
        }
    });
}
//# sourceMappingURL=log.js.map