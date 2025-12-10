import commander from 'commander';
import { execSync } from 'child_process';
import fs from 'fs';

// Mock modules before importing the handler
jest.mock('../isOsx');
jest.mock('../errorAndExit');
jest.mock('../log');
jest.mock('child_process');
jest.mock('forever', () => ({
  startDaemon: jest.fn(),
}));

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('handleAlksServerStart', () => {
  // Import mocks after jest.mock calls
  const { isOsx } = require('../isOsx');
  const { errorAndExit } = require('../errorAndExit');
  const { handleAlksServerStart } = require('./alks-server-start');

  const defaultOptions: commander.OptionValues = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (isOsx as jest.Mock).mockReturnValue(true);
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    (execSync as jest.Mock).mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when not on OSX', () => {
    it('should call errorAndExit with appropriate message', async () => {
      (isOsx as jest.Mock).mockReturnValue(false);

      await handleAlksServerStart(defaultOptions);

      expect(errorAndExit).toHaveBeenCalledWith(
        'The metadata server is only supported on OSX.'
      );
    });
  });

  describe('when on OSX', () => {
    describe('when daemon is not installed', () => {
      beforeEach(() => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      });

      it('should attempt to install pf anchor', async () => {
        await handleAlksServerStart(defaultOptions);

        expect(execSync).toHaveBeenCalledWith(
          expect.stringContaining('/com.coxautodev.alks /etc/pf.anchors/')
        );
      });

      it('should attempt to install launch daemon plist', async () => {
        await handleAlksServerStart(defaultOptions);

        expect(execSync).toHaveBeenCalledWith(
          expect.stringContaining(
            '/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/'
          )
        );
      });

      it('should attempt to load the launch daemon', async () => {
        await handleAlksServerStart(defaultOptions);

        expect(execSync).toHaveBeenCalledWith(
          'sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist'
        );
      });

      it('should use correct service path that includes /service directory', async () => {
        await handleAlksServerStart(defaultOptions);

        // Verify the path contains 'service/' directory (the fix we made)
        const calls = (execSync as jest.Mock).mock.calls;
        const cpCall = calls.find((call: string[]) =>
          call[0].includes('com.coxautodev.alks /etc/pf.anchors/')
        );
        expect(cpCall[0]).toMatch(/service\/com\.coxautodev\.alks/);
      });

      it('should handle execSync errors gracefully', async () => {
        (execSync as jest.Mock).mockImplementation(() => {
          throw new Error('Command failed');
        });

        // Should not throw, just log error
        await expect(
          handleAlksServerStart(defaultOptions)
        ).resolves.not.toThrow();
      });
    });

    describe('when daemon is already installed', () => {
      beforeEach(() => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      });

      it('should not attempt to install daemon rules', async () => {
        await handleAlksServerStart(defaultOptions);

        // execSync should not be called for sudo cp commands
        const sudoCpCalls = (execSync as jest.Mock).mock.calls.filter(
          (call: string[]) => call[0].includes('sudo cp')
        );
        expect(sudoCpCalls).toHaveLength(0);
      });

      it('should start the server daemon', async () => {
        const forever = require('forever');

        await handleAlksServerStart(defaultOptions);

        expect(forever.startDaemon).toHaveBeenCalled();
      });
    });
  });
});
