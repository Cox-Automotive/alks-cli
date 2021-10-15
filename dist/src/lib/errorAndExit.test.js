"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var program_1 = tslib_1.__importDefault(require("./program"));
var errorAndExit_1 = require("./errorAndExit");
jest.mock('cli-color', function () { return ({
    __esModule: true,
    red: jest.fn(),
}); });
jest.mock('./program');
jest.spyOn(global.process, 'exit');
jest.spyOn(global.console, 'error');
var e1 = new Error('ERROR1');
var e2 = new Error('ERROR2');
describe('errorAndExit', function () {
    var defaultTestCase = {
        message: 'hello',
        error: undefined,
        opts: function () { return ({}); },
        result: 'hello',
        code: 1,
    };
    var testCases = [
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when only a string is passed in the first argument' }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when only an error is passed in the first argument', message: e1, result: e1.message }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when a string is passed in the first argument and an error as the second', message: 'hello', error: e1, result: 'hello' }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an Error is passed in the first argument and another error as the second', message: e1, error: e2, result: e1.message }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when only a string is passed in the first argument in verbose mode', opts: function () { return ({
                verbose: true,
            }); }, result: expect.stringContaining('hello\n') }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when only an error is passed in the first argument in verbose mode', opts: function () { return ({
                verbose: true,
            }); }, message: e1, result: e1.stack }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when a string is passed in the first argument and an error as the second in verbose mode', opts: function () { return ({
                verbose: true,
            }); }, message: 'hello', error: e1, result: e1.stack }),
        tslib_1.__assign(tslib_1.__assign({}, defaultTestCase), { description: 'when an Error is passed in the first argument and another error as the second in verbose mode', opts: function () { return ({
                verbose: true,
            }); }, message: e1, error: e2, result: e1.stack }),
    ];
    var _loop_1 = function (t) {
        describe(t.description, function () {
            beforeEach(function () {
                cli_color_1.red.mockImplementation(function (str) { return str; });
                program_1.default.opts.mockImplementation(t.opts);
                global.console.error.mockImplementation(function () { });
                global.process.exit.mockImplementation(function () { return undefined; });
                errorAndExit_1.errorAndExit(t.message, t.error);
            });
            afterEach(function () {
                cli_color_1.red.mockReset();
                program_1.default.opts.mockReset();
                global.console.error.mockReset();
                global.process.exit.mockReset();
            });
            it('prints the correct error text', function () {
                expect(global.console.error).toHaveBeenCalledWith(t.result);
            });
            it('exits with the correct error code', function () {
                expect(process.exit).toHaveBeenCalledWith(t.code);
            });
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=errorAndExit.test.js.map