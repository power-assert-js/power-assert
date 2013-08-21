var assert = require('../../lib/power-assert'),
    expect = require('expect.js');

describe('power-assert message', function () {
    beforeEach(function () {
        this.expectPowerAssertMessage = function (body, expectedLines) {
            try {
                body();
                expect().fail("AssertionError should be thrown");
            } catch (e) {
                expect(e.message.split('\n').slice(2, -1)).to.eql(expectedLines.map(function (line) {
                    return '            ' + line; // BK: adding indentation
                }));
            }
        };
    });

    it('remaining regular functions', function () {
        assert.equal(1, '1');
        assert.notStrictEqual(1, '1');
        assert.deepEqual({foo: [1,2], bar: {hoge: 'fuga'}}, {bar: {hoge: 'fuga'}, foo: [1,2]});
    });


    it('Identifier with empty string', function () {
        var falsyStr = '';
        this.expectPowerAssertMessage(function () {
            assert(falsyStr);
        },[
            'assert(falsyStr);',
            '       |         ',
            '       ""        '
        ]);
    });


    it('Identifier with falsy number', function () {
        var falsyNum = 0;
        this.expectPowerAssertMessage(function () {
            assert(falsyNum);
        }, [
            'assert(falsyNum);',
            '       |         ',
            '       0         '
        ]);
    });


    it('UnaryExpression, negation', function () {
        var truth = true;
        this.expectPowerAssertMessage(function () {
            assert(!truth);
        }, [
            'assert(!truth);',
            '       ||      ',
            '       |true   ',
            '       false   '
        ]);
    });


    it('UnaryExpression, double negative', function () {
        var some = '';
        this.expectPowerAssertMessage(function () {
            assert(!!some);
        }, [
            'assert(!!some);',
            '       |||     ',
            '       ||""    ',
            '       |true   ',
            '       false   '
        ]);
    });


    it('typeof operator: assert(typeof foo !== "undefined");', function () {
        this.expectPowerAssertMessage(function () {
            assert(typeof foo !== "undefined");
        }, [
            'assert(typeof foo !== "undefined");',
            '       |          |                ',
            '       |          false            ',
            '       "undefined"                 '
        ]);
    });


    it('assert((delete foo.bar) === falsy);', function () {
        var falsy = 0,
            foo = {
                bar: {
                    baz: false
                }
            };
        this.expectPowerAssertMessage(function () {
            assert((delete foo.bar) === falsy);
        }, [
            'assert((delete foo.bar) === falsy);',
            '        |      |   |    |   |      ',
            '        |      |   |    |   0      ',
            '        |      |   |    false      ',
            '        |      |   {"baz":false}   ',
            '        true   {"bar":{"baz":false}}'
        ]);
    });


    it('assert(fuga === piyo);', function () {
        var fuga = 'foo',
            piyo = 8;
        this.expectPowerAssertMessage(function () {
            assert(fuga === piyo);
        }, [
            'assert(fuga === piyo);',
            '       |    |   |     ',
            '       |    |   8     ',
            '       |    false     ',
            '       "foo"          '
        ]);
    });


    it('assert(fuga !== piyo);', function () {
        var fuga = 'foo',
            piyo = 'foo';
        this.expectPowerAssertMessage(function () {
            assert(fuga !== piyo);
        }, [
            'assert(fuga !== piyo);',
            '       |    |   |     ',
            '       |    |   "foo" ',
            '       |    false     ',
            '       "foo"          '
        ]);
    });


    it('BinaryExpression with Literal and Identifier: assert(fuga !== 4);', function () {
        var fuga = 4;
        this.expectPowerAssertMessage(function () {
            assert(fuga !== 4);
        }, [
            'assert(fuga !== 4);',
            '       |    |      ',
            '       4    false  '
        ]);
    });


    it('assert(4 !== 4);', function () {
        this.expectPowerAssertMessage(function () {
            assert(4 !== 4);
        }, [
            'assert(4 !== 4);',
            '         |      ',
            '         false  '
        ]);
    });


    it('MemberExpression: assert(ary1.length === ary2.length);', function () {
        var ary1 = ['foo', 'bar'];
        var ary2 = ['aaa', 'bbb', 'ccc'];
        this.expectPowerAssertMessage(function () {
            assert(ary1.length === ary2.length);
        }, [
            'assert(ary1.length === ary2.length);',
            '       |    |      |   |    |       ',
            '       |    |      |   |    3       ',
            '       |    |      |   ["aaa","bbb","ccc"]',
            '       |    2      false            ',
            '       ["foo","bar"]                '
        ]);
    });


    it('LogicalExpression: assert(5 < actual && actual < 13);', function () {
        var actual = 16;
        this.expectPowerAssertMessage(function () {
            assert(5 < actual && actual < 13);
        }, [
            'assert(5 < actual && actual < 13);',
            '         | |         |      |     ',
            '         | 16        16     false ',
            '         true                     '
        ]);
    });


    it('LogicalExpression OR: assert.ok(actual < 5 || 13 < actual);', function () {
        var actual = 10;
        this.expectPowerAssertMessage(function () {
            assert.ok(actual < 5 || 13 < actual);
        }, [
            'assert.ok(actual < 5 || 13 < actual);',
            '          |      |         | |       ',
            '          |      |         | 10      ',
            '          10     false     false     '
        ]);
    });


    it('Characterization test of LogicalExpression current spec: assert(2 > actual && actual < 13);', function () {
        var actual = 5;
        this.expectPowerAssertMessage(function () {
            assert(2 > actual && actual < 13);
        }, [
            'assert(2 > actual && actual < 13);',
            '         | |                      ',
            '         | 5                      ',
            '         false                    '
        ]);
    });


    it('Deep MemberExpression chain: assert(foo.bar.baz);', function () {
        var foo = {
            bar: {
                baz: false
            }
        };
        this.expectPowerAssertMessage(function () {
            assert(foo.bar.baz);
        }, [
            'assert(foo.bar.baz);',
            '       |   |   |    ',
            '       |   |   false',
            '       |   {"baz":false}',
            '       {"bar":{"baz":false}}'
        ]);
    });


    it('assert(func());', function () {
        var func = function () { return false; };
        this.expectPowerAssertMessage(function () {
            assert(func());
        }, [
            'assert(func());',
            '       |       ',
            '       false   '
        ]);
    });


    it('assert(obj.age());', function () {
        var obj = {
            age: function () {
                return 0;
            }
        };
        this.expectPowerAssertMessage(function () {
            assert(obj.age());
        }, [
            'assert(obj.age());',
            '       |   |      ',
            '       {}  0      '
        ]);
    });


    it('CallExpression with arguments: assert(isFalsy(positiveInt));', function () {
        var isFalsy = function (arg) {
            return !(arg);
        };
        var positiveInt = 50;
        this.expectPowerAssertMessage(function () {
            assert(isFalsy(positiveInt));
        }, [
            'assert(isFalsy(positiveInt));',
            '       |       |             ',
            '       false   50            '
        ]);
    });


    it('assert(sum(one, two, three) === seven);', function () {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectPowerAssertMessage(function () {
            assert(sum(one, two, three) === seven);
        }, [
            'assert(sum(one, two, three) === seven);',
            '       |   |    |    |      |   |      ',
            '       |   |    |    |      |   7      ',
            '       6   1    2    3      false      '
        ]);
    });


    it('CallExpression with CallExpressions as arguments: assert(sum(sum(one, two), three) === sum(sum(two, three), seven));', function () {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectPowerAssertMessage(function () {
            assert(sum(sum(one, two), three) === sum(sum(two, three), seven));
        }, [
            'assert(sum(sum(one, two), three) === sum(sum(two, three), seven));',
            '       |   |   |    |     |      |   |   |   |    |       |       ',
            '       |   |   |    |     |      |   12  5   2    3       7       ',
            '       6   3   1    2     3      false                            '
        ]);
    });


    it('assert(math.calc.sum(one, two, three) === seven);', function () {
        var math = {
            calc: {
                sum: function () {
                    var result = 0;
                    for (var i = 0; i < arguments.length; i += 1) {
                        result += arguments[i];
                    }
                    return result;
                }
            }
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectPowerAssertMessage(function () {
            assert(math.calc.sum(one, two, three) === seven);
        }, [
            'assert(math.calc.sum(one, two, three) === seven);',
            '       |    |    |   |    |    |      |   |      ',
            '       |    |    |   |    |    |      |   7      ',
            '       |    {}   6   1    2    3      false      ',
            '       {"calc":{}}                               '
        ]);
    });


    it('Nested CallExpression with BinaryExpression: assert((three * (seven * ten)) === three);', function () {
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectPowerAssertMessage(function () {
            assert((three * (seven * ten)) === three);
        }, [
            'assert((three * (seven * ten)) === three);',
            '        |     |  |     | |     |   |      ',
            '        |     |  |     | |     |   3      ',
            '        |     |  |     | 10    false      ',
            '        |     |  7     70                 ',
            '        3     210                         '
        ]);
    });


    it('Simple BinaryExpression with comment', function () {
        var hoge = 'foo';
        var fuga = 'bar';
        this.expectPowerAssertMessage(function () {
            assert.ok(hoge === fuga, "comment");
        }, [
            'assert.ok(hoge === fuga, "comment");',
            '          |    |   |                ',
            '          |    |   "bar"            ',
            '          |    false                ',
            '          "foo"                     '
        ]);
    });


    it('Looooong string', function () {
        var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        this.expectPowerAssertMessage(function () {
            assert(longString === anotherLongString);
        }, [
            'assert(longString === anotherLongString);',
            '       |          |   |                  ',
            '       |          |   "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
            '       |          false                  ',
            '       "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"'
        ]);
    });


    it('double byte character width', function () {
        var fuga = 'あい',
            piyo = 'うえお';
        var concat = function (a, b) {
            return a + b;
        };
        this.expectPowerAssertMessage(function () {
            assert(!concat(fuga, piyo));
        }, [
            'assert(!concat(fuga, piyo));',
            '       ||      |     |      ',
            '       ||      |     "うえお"',
            '       ||      "あい"       ',
            '       |"あいうえお"        ',
            '       false                '
        ]);
    });


    it('Japanese hankaku width', function () {
        var fuga = 'ｱｲ',
            piyo = 'ｳｴｵ';
        var concat = function (a, b) {
            return a + b;
        };
        this.expectPowerAssertMessage(function () {
            assert(!concat(fuga, piyo));
        }, [
            'assert(!concat(fuga, piyo));',
            '       ||      |     |      ',
            '       ||      "ｱｲ"  "ｳｴｵ"  ',
            '       |"ｱｲｳｴｵ"             ',
            '       false                '
        ]);
    });

});
