"use strict";
var childProcess = require('child_process');
var chaiExec = require('@jsdevtools/chai-exec');
var chai = require('chai');
chai.use(chaiExec);
describe('My CLI', function () {
    beforeAll(function () {
        // input user name and exit
        var spawn = require('node:child_process').spawn;
        var cmd = spawnSync('alks', ['developer', 'configure']);
        cmd.stdout.setEncoding('utf8');
        cmd.stderr.setEncoding('utf8');
        var inputs = ['\n', 'shfinkel' + '\n', '\n', '\x03'];
        var _loop_1 = function (i) {
            setTimeout(function () {
                cmd.stdin.write(inputs[i]);
            }, 2000);
            if (i === inputs.length - 1) {
                cmd.kill('SIGINT');
            }
        };
        for (var i = 0; i < inputs.length; i++) {
            _loop_1(i);
        }
    });
    it('should use chaiExec', function () {
        // Run your CLI
        var myCLI = chaiExec('alks developer info');
        console.log(myCLI);
        console.log(typeof myCLI);
        // Should syntax
        myCLI.exitCode.should.equal(0);
    });
    // it('should use child_process to answer prompts', () => {
    //   // Run your CLI
    //   });
});
//# sourceMappingURL=endToEnd.test.js.map