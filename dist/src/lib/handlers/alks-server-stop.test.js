"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const alks_server_stop_1 = require("./alks-server-stop");
const isOsx_1 = require("../isOsx");
jest.mock('../isOsx');
const mockList = jest.fn();
const mockStopAll = jest.fn();
jest.mock('forever', () => ({
    list: (_verbose, callback) => mockList(_verbose, callback),
    stopAll: () => mockStopAll(),
}));
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => { });
// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
});
describe('handleAlksServerStop', () => {
    const defaultOptions = {};
    beforeEach(() => {
        jest.clearAllMocks();
        isOsx_1.isOsx.mockReturnValue(true);
    });
    describe('when not on OSX', () => {
        it('should print error and exit', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            isOsx_1.isOsx.mockReturnValue(false);
            yield expect((0, alks_server_stop_1.handleAlksServerStop)(defaultOptions)).rejects.toThrow('process.exit called');
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('only supported on OSX'));
            expect(mockExit).toHaveBeenCalledWith(0);
        }));
    });
    describe('when on OSX', () => {
        beforeEach(() => {
            isOsx_1.isOsx.mockReturnValue(true);
        });
        it('should check forever for running processes', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            mockList.mockImplementation((_verbose, callback) => {
                callback(null, null);
            });
            yield (0, alks_server_stop_1.handleAlksServerStop)(defaultOptions);
            expect(mockList).toHaveBeenCalledWith(false, expect.any(Function));
        }));
        describe('when server is not running', () => {
            it('should display message that server is not running', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                mockList.mockImplementation((_verbose, callback) => {
                    callback(null, null);
                });
                yield (0, alks_server_stop_1.handleAlksServerStop)(defaultOptions);
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not running'));
                expect(mockStopAll).not.toHaveBeenCalled();
            }));
        });
        describe('when server is running', () => {
            it('should stop all forever processes', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                mockList.mockImplementation((_verbose, callback) => {
                    callback(null, [{ uid: 'alks-metadata' }]);
                });
                yield (0, alks_server_stop_1.handleAlksServerStop)(defaultOptions);
                expect(mockStopAll).toHaveBeenCalled();
            }));
            it('should display message that server was stopped', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                mockList.mockImplementation((_verbose, callback) => {
                    callback(null, [{ uid: 'alks-metadata' }]);
                });
                yield (0, alks_server_stop_1.handleAlksServerStop)(defaultOptions);
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining('stopped'));
            }));
        });
    });
});
//# sourceMappingURL=alks-server-stop.test.js.map