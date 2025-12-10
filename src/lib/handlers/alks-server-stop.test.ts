import commander from 'commander';
import { handleAlksServerStop } from './alks-server-stop';
import { isOsx } from '../isOsx';

jest.mock('../isOsx');

const mockList = jest.fn();
const mockStopAll = jest.fn();

jest.mock('forever', () => ({
  list: (_verbose: boolean, callback: Function) => mockList(_verbose, callback),
  stopAll: () => mockStopAll(),
}));

// Silence console.error
jest.spyOn(global.console, 'error').mockImplementation(() => {});
// Silence console.log
jest.spyOn(global.console, 'log').mockImplementation(() => {});
// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

describe('handleAlksServerStop', () => {
  const defaultOptions: commander.OptionValues = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (isOsx as jest.Mock).mockReturnValue(true);
  });

  describe('when not on OSX', () => {
    it('should print error and exit', async () => {
      (isOsx as jest.Mock).mockReturnValue(false);

      await expect(handleAlksServerStop(defaultOptions)).rejects.toThrow(
        'process.exit called'
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('only supported on OSX')
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('when on OSX', () => {
    beforeEach(() => {
      (isOsx as jest.Mock).mockReturnValue(true);
    });

    it('should check forever for running processes', async () => {
      mockList.mockImplementation((_verbose, callback) => {
        callback(null, null);
      });

      await handleAlksServerStop(defaultOptions);

      expect(mockList).toHaveBeenCalledWith(false, expect.any(Function));
    });

    describe('when server is not running', () => {
      it('should display message that server is not running', async () => {
        mockList.mockImplementation((_verbose, callback) => {
          callback(null, null);
        });

        await handleAlksServerStop(defaultOptions);

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('not running')
        );
        expect(mockStopAll).not.toHaveBeenCalled();
      });
    });

    describe('when server is running', () => {
      it('should stop all forever processes', async () => {
        mockList.mockImplementation((_verbose, callback) => {
          callback(null, [{ uid: 'alks-metadata' }]);
        });

        await handleAlksServerStop(defaultOptions);

        expect(mockStopAll).toHaveBeenCalled();
      });

      it('should display message that server was stopped', async () => {
        mockList.mockImplementation((_verbose, callback) => {
          callback(null, [{ uid: 'alks-metadata' }]);
        });

        await handleAlksServerStop(defaultOptions);

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('stopped')
        );
      });
    });
  });
});
