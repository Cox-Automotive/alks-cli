"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const program_1 = tslib_1.__importDefault(require("./program"));
const errorAndExit_1 = require("./errorAndExit");
jest.mock('cli-color', () => ({
    __esModule: true,
    red: jest.fn(),
}));
jest.mock('./program');
jest.spyOn(global.process, 'exit');
jest.spyOn(global.console, 'error');
const e1 = new Error('ERROR1');
const e2 = new Error('ERROR2');
describe('errorAndExit', () => {
    const defaultTestCase = {
        message: 'hello',
        error: undefined,
        opts: () => ({}),
        result: 'hello',
        code: 1,
    };
    const testCases = [
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when only a string is passed in the first argument' }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when only an error is passed in the first argument', message: e1, result: e1.message }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when a string is passed in the first argument and an error as the second', message: 'hello', error: e1, result: 'hello' }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when an Error is passed in the first argument and another error as the second', message: e1, error: e2, result: e1.message }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when only a string is passed in the first argument in verbose mode', opts: () => ({
                verbose: true,
            }), result: expect.stringContaining('hello\n') }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when only an error is passed in the first argument in verbose mode', opts: () => ({
                verbose: true,
            }), message: e1, result: e1.stack }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when a string is passed in the first argument and an error as the second in verbose mode', opts: () => ({
                verbose: true,
            }), message: 'hello', error: e1, result: e1.stack }),
        Object.assign(Object.assign({}, defaultTestCase), { description: 'when an Error is passed in the first argument and another error as the second in verbose mode', opts: () => ({
                verbose: true,
            }), message: e1, error: e2, result: e1.stack }),
    ];
    for (const t of testCases) {
        describe(t.description, () => {
            beforeEach(() => {
                cli_color_1.red.mockImplementation((str) => str);
                program_1.default.opts.mockImplementation(t.opts);
                global.console.error.mockImplementation(() => { });
                global.process.exit.mockImplementation(() => undefined);
                (0, errorAndExit_1.errorAndExit)(t.message, t.error);
            });
            afterEach(() => {
                cli_color_1.red.mockReset();
                program_1.default.opts.mockReset();
                global.console.error.mockReset();
                global.process.exit.mockReset();
            });
            it('prints the correct error text', () => {
                expect(global.console.error).toHaveBeenCalledWith(t.result);
            });
            it('exits with the correct error code', () => {
                expect(process.exit).toHaveBeenCalledWith(t.code);
            });
        });
    }
});
//# sourceMappingURL=errorAndExit.test.js.map