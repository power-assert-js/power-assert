var q = require('qunitjs'),
    empower = require('../lib/empower'),
    output = [],
    puts = function (str) {
        output.push(str);
    },
    tap = (function (qu) {
        var qunitTap = require("qunit-tap");
        //qu.config.updateRate = 0;
        return qunitTap(qu, puts, {showSourceOnFailure: false});
    })(q),
    expect = require('expect.js');

q.assert = empower(q.assert);


function doQUnitTest (testName, body, expectedLines) {
    it(testName, function (done) {
        q.init();
        q.test(testName, function (assert) {
            body(assert);
            try {
                var actual = output[1].split('\n').slice(2, -1).join('\n');
                var expected = expectedLines.map(function (line) {
                    // BK: adding indentation
                    return '#         ' + line;
                }).join('\n');
                expect(actual).to.be(expected);
                done();
            } catch (e) {
                done(e);
            }
        });
        q.start();
    });
}


describe('QUnit adapter', function () {
    beforeEach(function () {
        output.length = 0;
    });


    doQUnitTest('Identifier with empty string', function (assert) {
        var falsyStr = '';
        assert.ok(falsyStr);
    }, [
        'assert.ok(falsyStr);',
        '          |         ',
        '          ""        '
    ]);


    doQUnitTest('Identifier with falsy number', function (assert) {
        var falsyNum = 0;
        assert.ok(falsyNum);
    }, [
        'assert.ok(falsyNum);',
        '          |         ',
        '          0         '
    ]);


    doQUnitTest('UnaryExpression, negation', function (assert) {
        var truth = true;
        assert.ok(!truth);
    }, [
        'assert.ok(!truth);',
        '           |      ',
        '           true   '
    ]);


    doQUnitTest('UnaryExpression, double negative', function (assert) {
        var some = '';
        assert.ok(!!some);
    }, [
        'assert.ok(!!some);',
        '            |     ',
        '            ""    '
    ]);


    doQUnitTest('typeof operator: assert.ok(typeof foo !== "undefined");', function (assert) {
        assert.ok(typeof foo !== "undefined");
    }, [
        'assert.ok(typeof foo !== "undefined");',
        '                     |                ',
        '                     false            '
    ]);


    // doQUnitTest('assert.ok(delete foo.bar);', function (assert) {
    //     var foo = {
    //         bar: {
    //             baz: false
    //         }
    //     };
    //     assert.ok(delete foo.bar);
    // }, [
    // ]);


    doQUnitTest('assert.ok(fuga === piyo);', function (assert) {
        var fuga = 'foo',
            piyo = 8;
        assert.ok(fuga === piyo);
    }, [
        'assert.ok(fuga === piyo);',
        '          |    |   |     ',
        '          |    |   8     ',
        '          |    false     ',
        '          "foo"          '
    ]);



    doQUnitTest('assert.ok(fuga !== piyo);', function (assert) {
        var fuga = 'foo',
            piyo = 'foo';
        assert.ok(fuga !== piyo);
    }, [
        'assert.ok(fuga !== piyo);',
        '          |    |   |     ',
        '          |    |   "foo" ',
        '          |    false     ',
        '          "foo"          '
    ]);



    doQUnitTest('BinaryExpression with Literal and Identifier: assert.ok(fuga !== 4);', function (assert) {
        var fuga = 4;
        assert.ok(fuga !== 4);
    }, [
        'assert.ok(fuga !== 4);',
        '          |    |      ',
        '          4    false  '
    ]);



    doQUnitTest('assert.ok(4 !== 4);', function (assert) {
        assert.ok(4 !== 4);
    }, [
        'assert.ok(4 !== 4);',
        '            |      ',
        '            false  '
    ]);



    doQUnitTest('MemberExpression: assert.ok(ary1.length === ary2.length);', function (assert) {
        var ary1 = ['foo', 'bar'];
        var ary2 = ['aaa', 'bbb', 'ccc'];
        assert.ok(ary1.length === ary2.length);
    }, [
        'assert.ok(ary1.length === ary2.length);',
        '          |    |      |   |    |       ',
        '          |    |      |   |    3       ',
        '          |    |      |   ["aaa","bbb","ccc"]',
        '          |    2      false            ',
        '          ["foo","bar"]                '
    ]);



    doQUnitTest('LogicalExpression: assert.ok(5 < actual && actual < 13);', function (assert) {
        var actual = 16;
        assert.ok(5 < actual && actual < 13);
    }, [
        'assert.ok(5 < actual && actual < 13);',
        '            | |         |      |     ',
        '            | 16        16     false ',
        '            true                     '
    ]);



    doQUnitTest('LogicalExpression OR: assert.ok(actual < 5 || 13 < actual);', function (assert) {
        var actual = 10;
        assert.ok(actual < 5 || 13 < actual);
    }, [
        'assert.ok(actual < 5 || 13 < actual);',
        '          |      |         | |       ',
        '          |      |         | 10      ',
        '          10     false     false     '
    ]);



    doQUnitTest('Characterization test of LogicalExpression current spec: assert.ok(2 > actual && actual < 13);', function (assert) {
        var actual = 5;
        assert.ok(2 > actual && actual < 13);
    }, [
        'assert.ok(2 > actual && actual < 13);',
        '            | |                      ',
        '            | 5                      ',
        '            false                    '
    ]);



    doQUnitTest('Deep MemberExpression chain: assert.ok(foo.bar.baz);', function (assert) {
        var foo = {
            bar: {
                baz: false
            }
        };
        assert.ok(foo.bar.baz);
    }, [
        'assert.ok(foo.bar.baz);',
        '          |   |   |    ',
        '          |   |   false',
        '          |   {"baz":false}',
        '          {"bar":{"baz":false}}'
    ]);



    doQUnitTest('assert.ok(func());', function (assert) {
        var func = function () { return false; };
        assert.ok(func());
    }, [
        'assert.ok(func());',
        '          |       ',
        '          false   '
    ]);



    doQUnitTest('assert.ok(obj.age());', function (assert) {
        var obj = {
            age: function () {
                return 0;
            }
        };
        assert.ok(obj.age());
    }, [
        'assert.ok(obj.age());',
        '          |   |      ',
        '          {}  0      '
    ]);



    doQUnitTest('CallExpression with arguments: assert.ok(isFalsy(positiveInt));', function (assert) {
        var isFalsy = function (arg) {
            return !(arg);
        };
        var positiveInt = 50;
        assert.ok(isFalsy(positiveInt));
    }, [
        'assert.ok(isFalsy(positiveInt));',
        '          |       |             ',
        '          false   50            '
    ]);



    doQUnitTest('assert.ok(sum(one, two, three) === seven);', function (assert) {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        assert.ok(sum(one, two, three) === seven);
    }, [
        'assert.ok(sum(one, two, three) === seven);',
        '          |   |    |    |      |   |      ',
        '          |   |    |    |      |   7      ',
        '          6   1    2    3      false      '
    ]);



    doQUnitTest('CallExpression with CallExpressions as arguments: assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven));', function (assert) {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven));
    }, [
        'assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven));',
        '          |   |   |    |     |      |   |   |   |    |       |       ',
        '          |   |   |    |     |      |   12  5   2    3       7       ',
        '          6   3   1    2     3      false                            '
    ]);



    doQUnitTest('assert.ok(math.calc.sum(one, two, three) === seven);', function (assert) {
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
        assert.ok(math.calc.sum(one, two, three) === seven);
    }, [
        'assert.ok(math.calc.sum(one, two, three) === seven);',
        '          |    |    |   |    |    |      |   |      ',
        '          |    |    |   |    |    |      |   7      ',
        '          |    {}   6   1    2    3      false      ',
        '          {"calc":{}}                               '
    ]);



    doQUnitTest('Nested CallExpression with BinaryExpression: assert.ok((three * (seven * ten)) === three);', function (assert) {
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        assert.ok((three * (seven * ten)) === three);
    }, [
        'assert.ok((three * (seven * ten)) === three);',
        '           |     |  |     | |     |   |      ',
        '           |     |  |     | |     |   3      ',
        '           |     |  |     | 10    false      ',
        '           |     |  7     70                 ',
        '           3     210                         '
    ]);



    doQUnitTest('Simple BinaryExpression with comment', function (assert) {
        var hoge = 'foo';
        var fuga = 'bar';
        assert.ok(hoge === fuga, "comment");
    }, [
        'assert.ok(hoge === fuga, "comment");',
        '          |    |   |                ',
        '          |    |   "bar"            ',
        '          |    false                ',
        '          "foo"                     '
    ]);



    doQUnitTest('Looooong string', function (assert) {
        var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        assert.ok(longString === anotherLongString);
    }, [
        'assert.ok(longString === anotherLongString);',
        '          |          |   |                  ',
        '          |          |   "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
        '          |          false                  ',
        '          "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"'
    ]);



    doQUnitTest('double byte character width', function (assert) {
        var fuga = 'あい',
            piyo = 'うえお';
        var concat = function (a, b) {
            return a + b;
        };
        assert.ok(!concat(fuga, piyo));
    }, [
        'assert.ok(!concat(fuga, piyo));',
        '           |      |     |      ',
        '           |      |     "うえお"',
        '           |      "あい"       ',
        '           "あいうえお"        '
    ]);



    doQUnitTest('Japanese hankaku width', function (assert) {
        var fuga = 'ｱｲ',
            piyo = 'ｳｴｵ';
        var concat = function (a, b) {
            return a + b;
        };
        assert.ok(!concat(fuga, piyo));
    }, [
        'assert.ok(!concat(fuga, piyo));',
        '           |      |     |      ',
        '           |      "ｱｲ"  "ｳｴｵ"  ',
        '           "ｱｲｳｴｵ"             '
    ]);

});
