var q = require('../test_helper').QUnit,
    instrument = require('../test_helper').instrument,
    enhancer = require('../lib/power-assert-core'),
    powerAssertTextLines = [],
    _pa_ = enhancer(null, function (powerOk, context, message, powerAssertText) {
        powerAssertTextLines = powerAssertText.split('\n');
    });

q.module('formatter & reporter', {
    setup: function () {
        powerAssertTextLines.length = 0;
    }
});

q.test('Identifier with empty string', function (assert) {
    var falsyStr = '';
    _pa_.ok(eval(instrument('assert(falsyStr);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(falsyStr);',
        '       |         ',
        '       ""        ',
        ''
    ]);
});


q.test('ReturnStatement', function (assert) {
    var falsyStr = '';
    _pa_.ok(eval(instrument('return assert(falsyStr);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'return assert(falsyStr);',
        '              |         ',
        '              ""        ',
        ''
    ]);
});


q.test('Identifier with falsy number', function (assert) {
    var falsyNum = 0;
    _pa_.ok(eval(instrument('assert(falsyNum);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(falsyNum);',
        '       |         ',
        '       0         ',
        ''
    ]);
});


q.test('UnaryExpression, negation', function (assert) {
    var truth = true;
    _pa_.ok(eval(instrument('assert(!truth);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(!truth);',
        '        |      ',
        '        true   ',
        ''
    ]);
});


q.test('UnaryExpression, double negative', function (assert) {
    var some = '';
    _pa_.ok(eval(instrument('assert(!!some);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(!!some);',
        '         |     ',
        '         ""    ',
        ''
    ]);
});


q.test('typeof operator: assert(typeof foo !== "undefined");', function (assert) {
    _pa_.ok(eval(instrument('assert(typeof foo !== "undefined");')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(typeof foo !== "undefined");',
        '                  |                ',
        '                  false            ',
        ''
    ]);
});


q.test('assert(delete foo.bar);', function (assert) {
    var foo = {
        bar: {
            baz: false
        }
    };
    _pa_.ok(eval(instrument('assert(delete foo.bar);')));
    assert.deepEqual(powerAssertTextLines, [
    ]);
});


q.test('assert(fuga === piyo);', function (assert) {
    var fuga = 'foo',
        piyo = 8;
    _pa_.ok(eval(instrument('assert(fuga === piyo);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(fuga === piyo);',
        '       |    |   |     ',
        '       |    |   8     ',
        '       |    false     ',
        '       "foo"          ',
        ''
    ]);
});


q.test('assert(fuga !== piyo);', function (assert) {
    var fuga = 'foo',
        piyo = 'foo';
    _pa_.ok(eval(instrument('assert(fuga !== piyo);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(fuga !== piyo);',
        '       |    |   |     ',
        '       |    |   "foo" ',
        '       |    false     ',
        '       "foo"          ',
        ''
    ]);
});


q.test('BinaryExpression with Literal and Identifier: assert(fuga !== 4);', function (assert) {
    var fuga = 4;
    _pa_.ok(eval(instrument('assert(fuga !== 4);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(fuga !== 4);',
        '       |    |      ',
        '       4    false  ',
        ''
    ]);
});


q.test('assert(4 !== 4);', function (assert) {
    _pa_.ok(eval(instrument('assert(4 !== 4);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(4 !== 4);',
        '         |      ',
        '         false  ',
        ''
    ]);
});


q.test('MemberExpression: assert(ary1.length === ary2.length);', function (assert) {
    var ary1 = ['foo', 'bar'];
    var ary2 = ['aaa', 'bbb', 'ccc'];
    _pa_.ok(eval(instrument('assert(ary1.length === ary2.length);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(ary1.length === ary2.length);',
        '       |    |      |   |    |       ',
        '       |    |      |   |    3       ',
        '       |    |      |   ["aaa","bbb","ccc"]',
        '       |    2      false            ',
        '       ["foo","bar"]                ',
        ''
    ]);
});


q.test('LogicalExpression: assert(5 < actual && actual < 13);', function (assert) {
    var actual = 16;
    _pa_.ok(eval(instrument('assert(5 < actual && actual < 13);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(5 < actual && actual < 13);',
        '         | |         |      |     ',
        '         | 16        16     false ',
        '         true                     ',
        ''
    ]);
});


q.test('LogicalExpression OR: assert.ok(actual < 5 || 13 < actual);', function (assert) {
    var actual = 10;
    _pa_.ok(eval(instrument('assert.ok(actual < 5 || 13 < actual);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert.ok(actual < 5 || 13 < actual);',
        '          |      |         | |       ',
        '          |      |         | 10      ',
        '          10     false     false     ',
        ''
    ]);
});


q.test('Characterization test of LogicalExpression current spec: assert(2 > actual && actual < 13);', function (assert) {
    var actual = 5;
    _pa_.ok(eval(instrument('assert(2 > actual && actual < 13);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(2 > actual && actual < 13);',
        '         | |                      ',
        '         | 5                      ',
        '         false                    ',
        ''
    ]);
});


q.test('Deep MemberExpression chain: assert(foo.bar.baz);', function (assert) {
    var foo = {
        bar: {
            baz: false
        }
    };
    _pa_.ok(eval(instrument('assert(foo.bar.baz);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(foo.bar.baz);',
        '       |   |   |    ',
        '       |   |   false',
        '       |   {"baz":false}',
        '       {"bar":{"baz":false}}',
        ''
    ]);
});


q.test('assert(func());', function (assert) {
    var func = function () { return false; };
    _pa_.ok(eval(instrument('assert(func());')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(func());',
        '       |       ',
        '       false   ',
        ''
    ]);
});


q.test('assert(obj.age());', function (assert) {
    var obj = {
        age: function () {
            return 0;
        }
    };
    _pa_.ok(eval(instrument('assert(obj.age());')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(obj.age());',
        '       |   |      ',
        '       {}  0      ',
        ''
    ]);
});


q.test('CallExpression with arguments: assert(isFalsy(positiveInt));', function (assert) {
    var isFalsy = function (arg) {
        return !(arg);
    };
    var positiveInt = 50;
    _pa_.ok(eval(instrument('assert(isFalsy(positiveInt));')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(isFalsy(positiveInt));',
        '       |       |             ',
        '       false   50            ',
        ''
    ]);
});


q.test('assert(sum(one, two, three) === seven);', function (assert) {
    var sum = function () {
        var result = 0;
        for (var i = 0; i < arguments.length; i += 1) {
            result += arguments[i];
        }
        return result;
    };
    var one = 1, two = 2, three = 3, seven = 7, ten = 10;
    _pa_.ok(eval(instrument('assert(sum(one, two, three) === seven);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(sum(one, two, three) === seven);',
        '       |   |    |    |      |   |      ',
        '       |   |    |    |      |   7      ',
        '       6   1    2    3      false      ',
        ''
    ]);
});


q.test('CallExpression with CallExpressions as arguments: assert(sum(sum(one, two), three) === sum(sum(two, three), seven));', function (assert) {
    var sum = function () {
        var result = 0;
        for (var i = 0; i < arguments.length; i += 1) {
            result += arguments[i];
        }
        return result;
    };
    var one = 1, two = 2, three = 3, seven = 7, ten = 10;
    _pa_.ok(eval(instrument('assert(sum(sum(one, two), three) === sum(sum(two, three), seven));')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(sum(sum(one, two), three) === sum(sum(two, three), seven));',
        '       |   |   |    |     |      |   |   |   |    |       |       ',
        '       |   |   |    |     |      |   12  5   2    3       7       ',
        '       6   3   1    2     3      false                            ',
        ''
    ]);
});


q.test('assert(math.calc.sum(one, two, three) === seven);', function (assert) {
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
    _pa_.ok(eval(instrument('assert(math.calc.sum(one, two, three) === seven);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(math.calc.sum(one, two, three) === seven);',
        '       |    |    |   |    |    |      |   |      ',
        '       |    |    |   |    |    |      |   7      ',
        '       |    {}   6   1    2    3      false      ',
        '       {"calc":{}}                               ',
        ''
    ]);
});


q.test('Nested CallExpression with BinaryExpression: assert((three * (seven * ten)) === three);', function (assert) {
    var one = 1, two = 2, three = 3, seven = 7, ten = 10;
    _pa_.ok(eval(instrument('assert((three * (seven * ten)) === three);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert((three * (seven * ten)) === three);',
        '        |     |  |     | |     |   |      ',
        '        |     |  |     | |     |   3      ',
        '        |     |  |     | 10    false      ',
        '        |     |  7     70                 ',
        '        3     210                         ',
        ''
    ]);
});


q.test('Simple BinaryExpression with comment', function (assert) {
    var hoge = 'foo';
    var fuga = 'bar';
    _pa_.ok(eval(instrument('assert.ok(hoge === fuga, "comment");')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert.ok(hoge === fuga, "comment");',
        '          |    |   |                ',
        '          |    |   "bar"            ',
        '          |    false                ',
        '          "foo"                     ',
        ''
    ]);
});


q.test('Looooong string', function (assert) {
    var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    _pa_.ok(eval(instrument('assert(longString === anotherLongString);')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(longString === anotherLongString);',
        '       |          |   |                  ',
        '       |          |   "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
        '       |          false                  ',
        '       "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
        ''
    ]);
});


q.test('double byte character width', function (assert) {
    var fuga = 'あい',
        piyo = 'うえお';
    var concat = function (a, b) {
        return a + b;
    };
    _pa_.ok(eval(instrument('assert(!concat(fuga, piyo));')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(!concat(fuga, piyo));',
        '        |      |     |      ',
        '        |      |     "うえお"',
        '        |      "あい"       ',
        '        "あいうえお"        ',
        ''
    ]);

});


q.test('Japanese hankaku width', function (assert) {
    var fuga = 'ｱｲ',
        piyo = 'ｳｴｵ';
    var concat = function (a, b) {
        return a + b;
    };
    _pa_.ok(eval(instrument('assert(!concat(fuga, piyo));')));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/some_test.js:1',
        '',
        'assert(!concat(fuga, piyo));',
        '        |      |     |      ',
        '        |      "ｱｲ"  "ｳｴｵ"  ',
        '        "ｱｲｳｴｵ"             ',
        ''
    ]);

});
