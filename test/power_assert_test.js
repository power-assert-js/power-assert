var _pa_ = require('../lib/power-assert');
_pa_.useDefault();

var q = require('qunitjs'),
    util = require('util'),
    orig = _pa_.puts;

(function (qu) {
    var qunitTap = require("qunit-tap").qunitTap;
    var tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
    qu.init();
    qu.config.updateRate = 0;
})(q);


q.module('formatter & reporter', {
    setup: function () {
        var that = this;
        that.lines = [];
        _pa_.puts = function (str) {
            that.lines.push(str);
        };
    },
    teardown: function () {
        _pa_.puts = orig;
    }
});


q.test('Simple BinaryExpression with comment', function (assert) {
    var hoge = 'foo';
    var fuga = 'bar';
    _pa_.expr(_pa_.binary(_pa_.ident(hoge, 14, 18) === _pa_.ident(fuga, 23, 27), 19, 22), '    assert.ok(hoge === fuga, \'comment\');', 8);
    assert.deepEqual(this.lines, [
        "# at line: 8",
        "    assert.ok(hoge === fuga, 'comment');",
        "              |    |   |                ",
        "              |    |   \"bar\"            ",
        "              |    false                ",
        "              \"foo\"                     ",
        ""
    ]);
});


q.test('Simple BinaryExpression', function (assert) {
    var fuga = 'bar';
    var piyo = 3;
    _pa_.expr(_pa_.binary(_pa_.ident(fuga, 10, 14) === _pa_.ident(piyo, 19, 23), 15, 18), 'assert.ok(fuga === piyo);', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert.ok(fuga === piyo);",
        "          |    |   |     ",
        "          |    |   3     ",
        "          |    false     ",
        "          \"bar\"          ",
        ""
    ]);
});


q.test('Looooong string', function (assert) {
    var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    _pa_.expr(_pa_.binary(_pa_.ident(longString, 14, 24) === _pa_.ident(anotherLongString, 29, 46), 25, 28), '    assert.ok(longString === anotherLongString);', 15);
    assert.deepEqual(this.lines, [
        "# at line: 15",
        "    assert.ok(longString === anotherLongString);",
        "              |          |   |                  ",
        "              |          |   \"yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message\"",
        "              |          false                  ",
        "              \"very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message\"",
        ""
    ]);
});


q.test('BinaryExpression with Literal and Identifier', function (assert) {
    var piyo = 3;
    _pa_.expr(_pa_.binary(4 === _pa_.ident(piyo, 20, 24), 16, 19), '    assert.ok(4 === piyo);', 17);
    assert.deepEqual(this.lines, [
        "# at line: 17",
        "    assert.ok(4 === piyo);",
        "                |   |     ",
        "                |   3     ",
        "                false     ",
        ""
    ]);
});


q.test('Literal only', function (assert) {
    _pa_.expr(_pa_.binary(4 !== 4, 16, 19), '    assert.ok(4 !== 4);', 19);
    assert.deepEqual(this.lines, [
        "# at line: 19",
        "    assert.ok(4 !== 4);",
        "                |      ",
        "                false  ",
        ""
    ]);
});


q.test('Identifier with empty string', function (assert) {
    var falsyStr = '';
    _pa_.expr(_pa_.ident(falsyStr, 14, 22), '    assert.ok(falsyStr);', 22);
    assert.deepEqual(this.lines, [
        "# at line: 22",
        "    assert.ok(falsyStr);",
        "              |         ",
        "              \"\"        ",
        ""
    ]);
});


q.test('Identifier with falsy number', function (assert) {
    var falsyNum = 0;
    _pa_.expr(_pa_.ident(falsyNum, 14, 22), '    assert.ok(falsyNum);', 25);
    assert.deepEqual(this.lines, [
        "# at line: 25",
        "    assert.ok(falsyNum);",
        "              |         ",
        "              0         ",
        ""
    ]);
});


q.test('MemberExpression', function (assert) {
    var ary1 = ['foo', 'bar'];
    var ary2 = ['aaa', 'bbb', 'ccc'];
    _pa_.expr(_pa_.binary(_pa_.ident(_pa_.ident(ary1, 14, 18).length, 19, 25) === _pa_.ident(_pa_.ident(ary2, 30, 34).length, 35, 41), 26, 29), '    assert.ok(ary1.length === ary2.length);', 29);
    assert.deepEqual(this.lines, [
        "# at line: 29",
        "    assert.ok(ary1.length === ary2.length);",
        "              |    |      |   |    |       ",
        "              |    |      |   |    3       ",
        "              |    |      |   [\"aaa\",\"bbb\",\"ccc\"]",
        "              |    2      false            ",
        "              [\"foo\",\"bar\"]                ",
        ""
    ]);
});


q.test('LogicalExpression', function (assert) {
    var actual = 16;
    _pa_.expr(_pa_.binary(5 < _pa_.ident(actual, 18, 24), 16, 17) && _pa_.binary(_pa_.ident(actual, 28, 34) < 13, 35, 36), '    assert.ok(5 < actual && actual < 13);', 32);
    assert.deepEqual(this.lines, [
        "# at line: 32",
        "    assert.ok(5 < actual && actual < 13);",
        "                | |         |      |     ",
        "                | 16        16     false ",
        "                true                     ",
        ""
    ]);
});


q.test('characterization test of LogicalExpression current spec', function (assert) {
    var actual = 4;
    _pa_.expr(_pa_.binary(5 < _pa_.ident(actual, 18, 24), 16, 17) && _pa_.binary(_pa_.ident(actual, 28, 34) < 13, 35, 36), '    assert.ok(5 < actual && actual < 13);', 35);
    assert.deepEqual(this.lines, [
        "# at line: 35",
        "    assert.ok(5 < actual && actual < 13);",
        "                | |                      ",
        "                | 4                      ",
        "                false                    ",
        ""
    ]);
});


q.test('LogicalExpression OR', function (assert) {
    var actual = 10;
    _pa_.expr(_pa_.binary(_pa_.ident(actual, 14, 20) < 5, 21, 22) || _pa_.binary(13 < _pa_.ident(actual, 33, 39), 31, 32), '    assert.ok(actual < 5 || 13 < actual);', 38);
    assert.deepEqual(this.lines, [
        "# at line: 38",
        "    assert.ok(actual < 5 || 13 < actual);",
        "              |      |         | |       ",
        "              |      |         | 10      ",
        "              10     false     false     ",
        ""
    ]);
});


q.test('deep MemberExpression chain', function (assert) {
    var foo = { bar: { baz: false } };
    _pa_.expr(_pa_.ident(_pa_.ident(_pa_.ident(foo, 14, 17).bar, 18, 21).baz, 22, 25), '    assert.ok(foo.bar.baz);', 46);
    assert.deepEqual(this.lines, [
        "# at line: 46",
        "    assert.ok(foo.bar.baz);",
        "              |   |   |    ",
        "              |   |   false",
        "              |   {\"baz\":false}",
        "              {\"bar\":{\"baz\":false}}",
        ""
    ]);
});


q.test('UnaryExpression', function (assert) {
    var truth = true;
    _pa_.expr(!_pa_.ident(truth, 15, 20), '    assert.ok(!truth);', 50);
    assert.deepEqual(this.lines, [
        "# at line: 50",
        "    assert.ok(!truth);",
        "               |      ",
        "               true   ",
        ""
    ]);
});


q.test('typeof operator', function (assert) {
    _pa_.expr(_pa_.binary(typeof foo !== 'undefined', 18, 21), 'assert(typeof foo !== \"undefined\");', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(typeof foo !== \"undefined\");",
        "                  |                ",
        "                  false            ",
        ""
    ]);
});


q.test('double negative', function (assert) {
    var some = 0;
    _pa_.expr(!!_pa_.ident(some, 9, 13), 'assert(!!some);', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(!!some);",
        "         |     ",
        "         0     ",
        ""
    ]);
});


q.test('delete operator', function (assert) {
    var foo = {bar: 'hoge'};
    _pa_.expr(delete _pa_.ident(_pa_.ident(foo, 14, 17).bar, 18, 21), 'assert(delete foo.bar);', 1);
    assert.deepEqual(this.lines, [
    ], 'do nothing since delete operator returns true');
});


q.test('simple CallExpression', function (assert) {
    var func = function () { return false; };
    _pa_.expr(_pa_.funcall(func(), 7, 13), 'assert(func());', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(func());",
        "       |       ",
        "       false   ",
        ""
    ]);
});

q.test('CallExpression with MemberExpression', function (assert) {
    var obj = {
        age: function () {
            return 0;
        }
    };
    _pa_.expr(_pa_.funcall(_pa_.ident(obj, 7, 10).age(), 11, 14), 'assert(obj.age());', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(obj.age());",
        "       |   |      ",
        "       {}  0      ",
        ""
    ]);
});

q.test('CallExpression with arguments', function (assert) {
    var isFalsy = function (arg) {
        return !(arg);
    };
    var positiveInt = 50;
    _pa_.expr(_pa_.funcall(isFalsy(_pa_.ident(positiveInt, 15, 26)), 7, 27), 'assert(isFalsy(positiveInt));', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(isFalsy(positiveInt));",
        "       |       |             ",
        "       false   50            ",
        ""
    ]);
});


var sum = function () {
    var result = 0;
    for (var i = 0; i < arguments.length; i += 1) {
        result += arguments[i];
    }
    return result;
};

q.test('CallExpression with many arguments', function (assert) {
    var one = 1, two = 2, three = 3, seven = 7;
    _pa_.expr(_pa_.binary(_pa_.funcall(sum(_pa_.ident(one, 11, 14), _pa_.ident(two, 16, 19), _pa_.ident(three, 21, 26)), 7, 27) === _pa_.ident(seven, 32, 37), 28, 31), 'assert(sum(one, two, three) === seven);', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(sum(one, two, three) === seven);",
        "       |   |    |    |      |   |      ",
        "       |   |    |    |      |   7      ",
        "       6   1    2    3      false      ",
        ""
    ]);
});


q.test('CallExpression with CallExpressions as arguments', function (assert) {
    var one = 1, two = 2, three = 3, seven = 7;
    _pa_.expr(_pa_.binary(_pa_.funcall(sum(_pa_.funcall(sum(_pa_.ident(one, 15, 18), _pa_.ident(two, 20, 23)), 11, 24), _pa_.ident(three, 26, 31)), 7, 32) === _pa_.funcall(sum(_pa_.funcall(sum(_pa_.ident(two, 45, 48), _pa_.ident(three, 50, 55)), 41, 56), _pa_.ident(seven, 58, 63)), 37, 64), 33, 36), 'assert(sum(sum(one, two), three) === sum(sum(two, three), seven));', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(sum(sum(one, two), three) === sum(sum(two, three), seven));",
        "       |   |   |    |     |      |   |   |   |    |       |       ",
        "       |   |   |    |     |      |   12  5   2    3       7       ",
        "       6   3   1    2     3      false                            ",
        ""
    ]);
});


q.test('Nested CallExpression with BinaryExpression', function (assert) {
    var one = 1, two = 2, three = 3, seven = 7, ten = 10;
    _pa_.expr(_pa_.binary(_pa_.binary(_pa_.ident(three, 8, 13) * _pa_.binary(_pa_.ident(seven, 17, 22) * _pa_.ident(ten, 25, 28), 23, 24), 14, 15) === _pa_.ident(three, 35, 40), 31, 34), 'assert((three * (seven * ten)) === three);', 1);
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert((three * (seven * ten)) === three);",
        "        |     |  |     | |     |   |      ",
        "        |     |  |     | |     |   3      ",
        "        |     |  |     | 10    false      ",
        "        |     |  7     70                 ",
        "        3     210                         ",
        ""
    ]);
});
