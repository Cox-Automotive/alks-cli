import { extractAccountId } from './extractAccountId';

interface TestCase {
  description: string;
  input: string;
  result: string | undefined;
  tests: TestFunction[];
}

type TestFunction = (t: TestCase) => void;

function checkResult(t: TestCase) {
  it('should return the expected result', () => {
    const result = extractAccountId(t.input);
    expect(result).toEqual(t.result);
  });
}

function shouldNotThrow(t: TestCase) {
  it('should not throw an error', () => {
    let err: Error | undefined;
    try {
      extractAccountId(t.input);
    } catch (e) {
      err = e as any;
    }

    expect(err).toBeUndefined();
  });
}

const testCases: TestCase[] = [
  {
    description: 'When an empty string is passed',
    input: '',
    result: undefined,
    tests: [checkResult, shouldNotThrow],
  },
  {
    description: 'When a Valid Account is passed',
    input: '111111111111',
    result: '111111111111',
    tests: [checkResult, shouldNotThrow],
  },
  {
    description: 'When Account/Role is passed',
    input: '111111111111/ALKSRole',
    result: '111111111111',
    tests: [checkResult, shouldNotThrow],
  },
  {
    description: 'When invalid account is passed',
    input: '11111j111111/ALKSRole',
    result: undefined,
    tests: [checkResult, shouldNotThrow],
  },
];

describe('extractAccountId', () => {
  for (const t of testCases) {
    describe(t.description, () => {
      for (const test of t.tests) {
        test(t);
      }
    });
  }
});
