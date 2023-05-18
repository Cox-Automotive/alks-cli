const chaiExec = require('@jsdevtools/chai-exec');
const chai = require('chai');

chai.use(chaiExec);

describe('My CLI', () => {
  it('should do something', () => {
    // Run your CLI
    let myCLI = chaiExec('alks developer info');

    console.log(myCLI.exitCode);
    console.log(typeof myCLI);

    // Should syntax
    myCLI.exitCode;
    // myCLI.should.exit.with.code(0);
    // myCLI.stdout.should.contain("Success!");
    // myCLI.stderr.should.be.empty;

    // // Expect sytnax
    // expect(myCLI).to.exit.with.code(0);
    // expect(myCLI).stdout.to.contain("Success!");
    // expect(myCLI).stderr.to.be.empty;

    // // Assert syntax
    // assert.exitCode(myCLI, 0);
    // assert.stdout(myCLI, "Success!");
    // assert.stderr(myCLI, "");
  });
});
