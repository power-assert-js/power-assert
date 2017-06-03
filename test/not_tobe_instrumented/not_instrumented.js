if (typeof window === 'undefined') {
    var expect = require('expect.js');
    var assert = require('../..');
}

describe('power-assert client should work with not-instrumented code', function () {
    beforeEach(function () {
        this.expectAssertMessage = function (body) {
            try {
                body();
                expect().fail("AssertionError should be thrown");
            } catch (e) {
                expect(e.name).to.match(/^AssertionError/);
                expect(e.message).to.be('plain assertion message');
            }
        };
    });

    it('Nested CallExpression with BinaryExpression: assert((three * (seven * ten)) === three);', function () {
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectAssertMessage(function () {
            assert.ok((three * (seven * ten)) === three, 'plain assertion message');
        });
    });

    it('equal with Literal and Identifier: assert.equal(1, minusOne);', function () {
        var minusOne = -1;
        this.expectAssertMessage(function () {
            assert.equal(1, minusOne, 'plain assertion message');
        });
    });
});
