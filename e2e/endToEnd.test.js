const childProcess = require('child_process');
const chaiExec = require('@jsdevtools/chai-exec');
const chai = require('chai');

chai.use(chaiExec);

describe('My CLI', () => {

  beforeAll(() => {
    // input user name and exit
    const { spawn } = require('node:child_process');
    const cmd = spawnSync('alks', ['developer', 'configure']);
    cmd.stdout.setEncoding('utf8');
    cmd.stderr.setEncoding('utf8');

    const inputs = ['\n', 'shfinkel' + '\n', '\n', '\x03']
    for (let i = 0; i < inputs.length; i++) {
      setTimeout(() => {
        cmd.stdin.write(inputs[i]);
      }, 2000);

      if (i === inputs.length - 1) {
        cmd.kill('SIGINT');
      }
    }

  });

  it('should use chaiExec', () => {
    // Run your CLI
    let myCLI = chaiExec('alks developer info');

    console.log(myCLI);
    console.log(typeof myCLI);

    // Should syntax
    myCLI.exitCode.should.equal(0);
  });
  // it('should use child_process to answer prompts', () => {
  //   // Run your CLI
  //   });
  });
