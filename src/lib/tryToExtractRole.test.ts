import { tryToExtractRole } from './tryToExtractRole';

interface TestCase {
  description: string;
  input: string;
  result: string | undefined;
  tests: TestFunction[];
}

type TestFunction = (t: TestCase) => void;

function checkResult(t: TestCase) {
  it('should return the expected result', () => {
    const result = tryToExtractRole(t.input);
    expect(result).toEqual(t.result);
  });
}

function shouldNotThrow(t: TestCase) {
  it('should not throw an error', () => {
    let err: Error | undefined;
    try {
      tryToExtractRole(t.input);
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
    description: 'When Account And Role is passed',
    input: '111111111111/ALKSRole',
    result: 'Role',
    tests: [checkResult, shouldNotThrow],
  },
  {
    description: 'When account and role is passed in incorrect format',
    input: '111111111111/Role',
    result: undefined,
    tests: [checkResult, shouldNotThrow],
  },
  {
    description: 'When legacy account/role is passed',
    input: '111111111111/ALKSRole-OldRole',
    result: 'Role',
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
