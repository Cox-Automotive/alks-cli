import { Tag } from 'alks.js';
import { unpackTags } from './unpackTags';

interface TestCase {
  description: string;
  input: string[];
  result: Tag[];
  tests: TestFunction[];
}

type TestFunction = (t: TestCase) => void;

function checkResult(t: TestCase) {
  it('should return the expected result', () => {
    const result = unpackTags(t.input);
    expect(result).toEqual(t.result);
  });
}

function shouldNotThrow(t: TestCase) {
  it('should not throw an error', () => {
    let err: Error | undefined;
    try {
      unpackTags(t.input);
    } catch (e) {
      err = e as any;
    }

    expect(err).toBeUndefined();
  });
}

const testCases: TestCase[] = [
  {
    description: 'when the input is a JSON string with a single tag',
    input: ['{"Key":"foo", "Value":"bar"}'],
    result: [{ key: 'foo', value: 'bar' }],
    tests: [checkResult, shouldNotThrow],
  },
  {
    description: 'when the input is a single shorthand tag',
    input: ['Key=foo,Value=bar'],
    result: [{ key: 'foo', value: 'bar' }],
    tests: [checkResult, shouldNotThrow],
  },
  {
    description: 'when the input is JSON string with multiple tags',
    input: ['[{"Key":"foo1", "Value":"bar1"}, {"Key":"foo2", "Value":"bar2"}]'],
    result: [
      { key: 'foo1', value: 'bar1' },
      { key: 'foo2', value: 'bar2' },
    ],
    tests: [checkResult, shouldNotThrow],
  },
  // {
  //   description:
  //     'when the input is a JSON string with a single tag array value',
  //   input: ['{"Key":"foo", "Value":["bar", "bardot"]}'],
  //   result: {
  //     Key: 'foo',
  //     Value: ['bar', 'bardot'],
  //   },
  //   tests: [checkResult, shouldNotThrow],
  // },
  //   {
  //     description:
  //       'when the input is multiple key=value items in the same string',
  //     input: ['alpha=beta,gamma=delta'],
  //     result: {
  //       alpha: 'beta',
  //       gamma: 'delta',
  //     },
  //     tests: [checkResult, shouldNotThrow],
  //   },
  //   {
  //     description: 'when the input is a single JSON style item',
  //     input: ['{"alpha":"beta"}'],
  //     result: {
  //       alpha: 'beta',
  //     },
  //     tests: [checkResult, shouldNotThrow],
  //   },
  //   {
  //     description: 'when the input is a JSON object with multiple items',
  //     input: ['{"alpha":"beta","gamma":"delta"}'],
  //     result: {
  //       alpha: 'beta',
  //       gamma: 'delta',
  //     },
  //     tests: [checkResult, shouldNotThrow],
  //   },
  //   {
  //     description: 'when the input is multiple JSON items',
  //     input: ['{"alpha":"beta"}', '{"gamma":"delta"}'],
  //     result: {
  //       alpha: 'beta',
  //       gamma: 'delta',
  //     },
  //     tests: [checkResult, shouldNotThrow],
  //   },
  //   {
  //     description: 'when the input is a mix of JSON items and key-value pairs',
  //     input: ['{"alpha":"beta"}', 'gamma=delta'],
  //     result: {
  //       alpha: 'beta',
  //       gamma: 'delta',
  //     },
  //     tests: [checkResult, shouldNotThrow],
  //   },
  //   {
  //     description: 'when the input is an empty string',
  //     input: [''],
  //     result: {},
  //     tests: [checkResult, shouldNotThrow],
  //   },
  //   {
  //     description: 'when the input is invalid JSON',
  //     input: ['{"alpha":"beta'],
  //     result: {},
  //     tests: [checkResult, shouldNotThrow],
  //   },
  //   {
  //     description: 'when the input is invalid comma-separated key=value pairs',
  //     input: ['alpha,beta,=gamma,delta='],
  //     result: {},
  //     tests: [checkResult, shouldNotThrow],
  //   },
];

describe('unpackTags', () => {
  for (const t of testCases) {
    describe(t.description, () => {
      for (const test of t.tests) {
        test(t);
      }
    });
  }
});
