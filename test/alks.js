/*jslint node: true */
'use strict';

var mashery = require('../lib/keys');
var assert = require('chai').assert;

describe('alks-cli', function(){
    it('should write some tests', function(done){
        done();
    });

    describe('utils', function() {
        var utils = require('../lib/utils.js');

        // isWindows test added to verify that sniffing process.env.PLATFORM
        // doesn't break anything -- james.lance
        describe('isWindows', function() {
            var plat = process.platform;
            // Basic sanity check here
            it('isWindows is boolean', function() {
                assert.isBoolean(utils.isWindows(), 'isWindows returns a Bool');
            });

            // This test is a bit quirky, but will change depending on what
            // platform you are testing on
            if (/^win/.test(plat)) {
                it('native platform is Windows', function() {
                    assert.equal(utils.isWindows(), true, 'isWindows detects the correct OS');
                });
            } else {
                it('native platform is not Windows', function() {
                    assert.equal(utils.isWindows(), false, 'isWindows detects the correct OS');
                });
            }

            // Now test the environment variable override
            it('setting env.platform=linux returns false', function() {
                process.env['PLATFORM']='linux';
                assert.isFalse(utils.isWindows(), 'not windows');
            })

            it('setting env.platform=windows returns true', function() {
                process.env['PLATFORM']='windows';
                assert.isTrue(utils.isWindows(), 'is windows');
            })
        });
    });
});
