if (typeof window === 'undefined') {
    var expect = require('expect.js');
    var assert = require('../..');
}

describe('strict mode support', function () {

    var legacyModeAssert = assert;

    beforeEach(function () {
        assert = assert.strict;
    });
    afterEach(function () {
        assert = legacyModeAssert;
    });

    function expectPowerAssertMessage (body, expectedLines) {
        try {
            body();
            expect().fail("AssertionError should be thrown");
        } catch (e) {
            if (e.message === 'AssertionError should be thrown') {
                throw e;
            }
            expect(e.message.split('\n').slice(2, -1)).to.eql(expectedLines);
        }
    };

    it('`strict` mode assert should also have `strict` property', function () {
        expect(typeof assert.strict).to.equal('function');
    });

    it('`strict` property of strict mode assert should also be an empowered one', function () {
        // `_empowered` is a hidden property to determine whether target function is already empowered or not.
        expect(assert.strict._empowered).to.equal(true);
    });

    it('`strict` mode assert should also be a function', function () {
        var foo = 'foo', bar = 8;
        expectPowerAssertMessage(function () {
            assert(foo === bar);
        }, [
            '  assert(foo === bar)',
            '         |   |   |   ',
            '         |   |   8   ',
            '         |   false   ',
            '         "foo"       ',
            '  ',
            '  [number] bar',
            '  => 8',
            '  [string] foo',
            '  => "foo"'
        ]);
    });

    it('equal becomes strictEqual', function () {
        var three = 3, threeInStr = '3';
        expectPowerAssertMessage(function () {
            assert.equal(three, threeInStr);
        },[
            '  assert.equal(three, threeInStr)',
            '               |      |          ',
            '               3      "3"        '
        ]);
    });

    it('deepEqual becomes deepStrictEqual', function () {
        var three = 3, threeInStr = '3';
        expectPowerAssertMessage(function () {
            assert.deepEqual({a: three}, {a: threeInStr});
        },[
            '  assert.deepEqual({ a: three }, { a: threeInStr })',
            '                   |    |        |    |            ',
            '                   |    |        |    "3"          ',
            '                   |    3        Object{a:"3"}     ',
            '                   Object{a:3}                     '
        ]);
    });

    it('structural compatibility between strict mode and legacy mode', function () {
        var legacyModeProps = Object.keys(legacyModeAssert);
        expect(legacyModeProps.length).to.be.above(0);
        legacyModeProps.every(function (name) {
            expect(assert).to.have.property(name);
            expect(typeof assert[name]).to.be.equal(typeof legacyModeAssert[name]);
        });
    });
});
