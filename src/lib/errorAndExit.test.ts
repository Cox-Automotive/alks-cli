import { red } from 'cli-color';
import program from './program';
import { errorAndExit } from './errorAndExit';

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
  interface TestCase {
    description: string;
    message: string | Error;
    error?: Error;
    opts: typeof program.opts;
    result: string;
    code: number;
  }

  const defaultTestCase: Omit<TestCase, 'description'> = {
    message: 'hello',
    error: undefined,
    opts: () => ({}),
    result: 'hello',
    code: 1,
  };

  const testCases: TestCase[] = [
    {
      ...defaultTestCase,
      description: 'when only a string is passed in the first argument',
    },
    {
      ...defaultTestCase,
      description: 'when only an error is passed in the first argument',
      message: e1,
      result: e1.message,
    },
    {
      ...defaultTestCase,
      description:
        'when a string is passed in the first argument and an error as the second',
      message: 'hello',
      error: e1,
      result: 'hello',
    },
    {
      ...defaultTestCase,
      description:
        'when an Error is passed in the first argument and another error as the second',
      message: e1,
      error: e2,
      result: e1.message,
    },
    {
      ...defaultTestCase,
      description:
        'when only a string is passed in the first argument in verbose mode',
      opts: () => ({
        verbose: true,
      }),
      result: expect.stringContaining('hello\n'),
    },
    {
      ...defaultTestCase,
      description:
        'when only an error is passed in the first argument in verbose mode',
      opts: () => ({
        verbose: true,
      }),
      message: e1,
      result: e1.stack,
    },
    {
      ...defaultTestCase,
      description:
        'when a string is passed in the first argument and an error as the second in verbose mode',
      opts: () => ({
        verbose: true,
      }),
      message: 'hello',
      error: e1,
      result: e1.stack,
    },
    {
      ...defaultTestCase,
      description:
        'when an Error is passed in the first argument and another error as the second in verbose mode',
      opts: () => ({
        verbose: true,
      }),
      message: e1,
      error: e2,
      result: e1.stack,
    },
  ];

  for (const t of testCases) {
    describe(t.description, () => {
      beforeEach(() => {
        ((red as unknown) as jest.Mock).mockImplementation((str) => str);
        ((program.opts as unknown) as jest.Mock).mockImplementation(t.opts);
        (global.console.error as jest.Mock).mockImplementation(() => {});
        ((global.process.exit as unknown) as jest.Mock).mockImplementation(
          () => undefined
        );
        errorAndExit(t.message, t.error);
      });

      afterEach(() => {
        ((red as unknown) as jest.Mock).mockReset();
        ((program.opts as unknown) as jest.Mock).mockReset();
        (global.console.error as jest.Mock).mockReset();
        ((global.process.exit as unknown) as jest.Mock).mockReset();
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
