(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['power-assert', 'expect'], factory);
    } else if (typeof exports === 'object') {
        factory(require('../..'), require('expect.js'));
    } else {
        factory(root.assert, root.expect);
    }
}(this, function (assert, expect) {

    var orininalAssert = assert;

    function expectPowerAssertMessage (body, expectedLines) {
        try {
            body();
            expect().fail("AssertionError should be thrown");
        } catch (e) {
            if (e.message === 'AssertionError should be thrown') {
                throw e;
            }
            expect(e.message.split('\n').slice(2, -1)).to.eql(expectedLines.map(function (line) {
                return line;
            }));
        }
    };

    describe('power-assert customization', function () {
        beforeEach(function () {
            this.foo = {name: 'foo'};
            this.bar = {name: 'bar', parent: this.foo};
            this.baz = {name: 'baz', parent: this.bar};
            this.quux = {name: 'quux', parent: this.baz};
        });
        afterEach(function () {
            assert = orininalAssert;
        });
        
        describe('formatter.maxDepth', function () {
            it('default', function () {
                var expected = [this.foo, this.bar, this.baz];
                var actual = [this.baz, this.quux, this.bar];
                expectPowerAssertMessage(function () {
                    assert.deepEqual(expected, actual);
                },[
                    '  assert.deepEqual(expected, actual)',
                    '                   |         |      ',
                    '                   |         [#Object#,#Object#,#Object#]',
                    '                   [#Object#,#Object#,#Object#]'
                ]);
            });

            it('customize maxDepth', function () {
                assert = assert.customize({
                    output: {
                        maxDepth: 2
                    }
                });
                var expected = [this.foo, this.bar, this.baz];
                var actual = [this.baz, this.quux, this.bar];
                expectPowerAssertMessage(function () {
                    assert.deepEqual(expected, actual);
                },[
                    '  assert.deepEqual(expected, actual)',
                    '                   |         |      ',
                    '                   |         [Object{name:"baz",parent:#Object#},Object{name:"quux",parent:#Object#},Object{name:"bar",parent:#Object#}]',
                    '                   [Object{name:"foo"},Object{name:"bar",parent:#Object#},Object{name:"baz",parent:#Object#}]'
                ]);
            });


            it('set maxDepth more deeper', function () {
                assert = assert.customize({
                    output: {
                        maxDepth: 3
                    }
                });
                var expected = [this.foo, this.bar, this.baz];
                var actual = [this.baz, this.quux, this.bar];
                expectPowerAssertMessage(function () {
                    assert.deepEqual(expected, actual);
                },[
                    '  assert.deepEqual(expected, actual)',
                    '                   |         |      ',
                    '                   |         [Object{name:"baz",parent:Object{name:"bar",parent:#Object#}},Object{name:"quux",parent:Object{name:"baz",parent:#Object#}},Object{name:"bar",parent:Object{name:"foo"}}]',
                    '                   [Object{name:"foo"},Object{name:"bar",parent:Object{name:"foo"}},Object{name:"baz",parent:Object{name:"bar",parent:#Object#}}]'
                ]);
            });


            it('maxDepth=0 means dump them all', function () {
                assert = assert.customize({
                    output: {
                        maxDepth: 0
                    }
                });
                var expected = [this.foo, this.bar, this.baz];
                var actual = [this.baz, this.quux, this.bar];
                expectPowerAssertMessage(function () {
                    assert.deepEqual(expected, actual);
                },[
                    '  assert.deepEqual(expected, actual)',
                    '                   |         |      ',
                    '                   |         [Object{name:"baz",parent:Object{name:"bar",parent:Object{name:"foo"}}},Object{name:"quux",parent:Object{name:"baz",parent:Object{name:"bar",parent:Object{name:"foo"}}}},Object{name:"bar",parent:Object{name:"foo"}}]',
                    '                   [Object{name:"foo"},Object{name:"bar",parent:Object{name:"foo"}},Object{name:"baz",parent:Object{name:"bar",parent:Object{name:"foo"}}}]'
                ]);
            });
        });


        it('customized assert should also be customizable', function () {
            var expected = [this.foo, this.bar, this.baz];
            var actual = [this.baz, this.quux, this.bar];
            assert = assert.customize({
                output: {
                    maxDepth: 2
                }
            });
            expectPowerAssertMessage(function () {
                assert.deepEqual(expected, actual);
            },[
                '  assert.deepEqual(expected, actual)',
                '                   |         |      ',
                '                   |         [Object{name:"baz",parent:#Object#},Object{name:"quux",parent:#Object#},Object{name:"bar",parent:#Object#}]',
                '                   [Object{name:"foo"},Object{name:"bar",parent:#Object#},Object{name:"baz",parent:#Object#}]'
            ]);

            assert = assert.customize({
                output: {
                    maxDepth: 3
                }
            });
            expectPowerAssertMessage(function () {
                assert.deepEqual(expected, actual);
            },[
                '  assert.deepEqual(expected, actual)',
                '                   |         |      ',
                '                   |         [Object{name:"baz",parent:Object{name:"bar",parent:#Object#}},Object{name:"quux",parent:Object{name:"baz",parent:#Object#}},Object{name:"bar",parent:Object{name:"foo"}}]',
                '                   [Object{name:"foo"},Object{name:"bar",parent:Object{name:"foo"}},Object{name:"baz",parent:Object{name:"bar",parent:#Object#}}]'
            ]);
        });
        
    });

}));
