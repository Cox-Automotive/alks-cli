"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs_1 = tslib_1.__importDefault(require("fs"));
// Mock modules before importing the handler
jest.mock('../isOsx');
jest.mock('../errorAndExit');
jest.mock('../log');
jest.mock('child_process');
jest.mock('forever', () => ({
    startDaemon: jest.fn(),
}));
// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => { });
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => { });
describe('handleAlksServerStart', () => {
    // Import mocks after jest.mock calls
    const { isOsx } = require('../isOsx');
    const { errorAndExit } = require('../errorAndExit');
    const { handleAlksServerStart } = require('./alks-server-start');
    const defaultOptions = {};
    beforeEach(() => {
        jest.clearAllMocks();
        isOsx.mockReturnValue(true);
        jest.spyOn(fs_1.default, 'existsSync').mockReturnValue(false);
        child_process_1.execSync.mockReturnValue(undefined);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('when not on OSX', () => {
        it('should call errorAndExit with appropriate message', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            isOsx.mockReturnValue(false);
            yield handleAlksServerStart(defaultOptions);
            expect(errorAndExit).toHaveBeenCalledWith('The metadata server is only supported on OSX.');
        }));
    });
    describe('when on OSX', () => {
        describe('when daemon is not installed', () => {
            beforeEach(() => {
                jest.spyOn(fs_1.default, 'existsSync').mockReturnValue(false);
            });
            it('should attempt to install pf anchor', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield handleAlksServerStart(defaultOptions);
                expect(child_process_1.execSync).toHaveBeenCalledWith(expect.stringContaining('/com.coxautodev.alks /etc/pf.anchors/'));
            }));
            it('should attempt to install launch daemon plist', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield handleAlksServerStart(defaultOptions);
                expect(child_process_1.execSync).toHaveBeenCalledWith(expect.stringContaining('/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/'));
            }));
            it('should attempt to load the launch daemon', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield handleAlksServerStart(defaultOptions);
                expect(child_process_1.execSync).toHaveBeenCalledWith('sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist');
            }));
            it('should use correct service path that includes /service directory', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield handleAlksServerStart(defaultOptions);
                // Verify the path contains 'service/' directory (the fix we made)
                const calls = child_process_1.execSync.mock.calls;
                const cpCall = calls.find((call) => call[0].includes('com.coxautodev.alks /etc/pf.anchors/'));
                expect(cpCall[0]).toMatch(/service\/com\.coxautodev\.alks/);
            }));
            it('should handle execSync errors gracefully', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                child_process_1.execSync.mockImplementation(() => {
                    throw new Error('Command failed');
                });
                // Should not throw, just log error
                yield expect(handleAlksServerStart(defaultOptions)).resolves.not.toThrow();
            }));
        });
        describe('when daemon is already installed', () => {
            beforeEach(() => {
                jest.spyOn(fs_1.default, 'existsSync').mockReturnValue(true);
            });
            it('should not attempt to install daemon rules', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield handleAlksServerStart(defaultOptions);
                // execSync should not be called for sudo cp commands
                const sudoCpCalls = child_process_1.execSync.mock.calls.filter((call) => call[0].includes('sudo cp'));
                expect(sudoCpCalls).toHaveLength(0);
            }));
            it('should start the server daemon', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const forever = require('forever');
                yield handleAlksServerStart(defaultOptions);
                expect(forever.startDaemon).toHaveBeenCalled();
            }));
        });
    });
});
//# sourceMappingURL=alks-server-start.test.js.map