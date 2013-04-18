var empower = require('../lib/empower'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    q = require('qunitjs'),
    tap,
    _pa_ = require('../lib/power-assert');
_pa_.useDefault();

(function (qu) {
    var qunitTap = require("qunit-tap").qunitTap,
        util = require('util');
    tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
    qu.init();
    qu.config.updateRate = 0;
})(q);


q.module('formatter & reporter', {
    setup: function () {
        var that = this;
        that.lines = [];
        this.origPuts = _pa_.puts;
        _pa_.puts = function (str) {
            that.lines.push(str);
        };
    },
    teardown: function () {
        _pa_.puts = this.origPuts;
    }
});


var instrument = function () {
    var extractBodyFrom = function (source) {
        var tree = esprima.parse(source, {tolerant: true, loc: true});
        return tree.body[0];
    };
    var extractBodyOfAssertionAsCode = function (node) {
        var expression;
        if (node.type === 'ExpressionStatement') {
            expression = node.expression;
        } else if (node.type === 'ReturnStatement') {
            expression = node.argument;
        }
        return escodegen.generate(expression.arguments[0], {format: {compact: true}});
    };
    return function (line) {
        var tree = extractBodyFrom(line);
        empower.instrumentTree(tree, {module: 'commonjs', strategy: 'inline', source: line});
        var instrumentedCode = extractBodyOfAssertionAsCode(tree);
        //tap.note(instrumentedCode);
        return instrumentedCode;
    };
}();


q.test('Identifier with empty string', function (assert) {
    var falsyStr = '';
    eval(instrument('assert(falsyStr);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(falsyStr);",
        "       |         ",
        "       \"\"        ",
        ""
    ]);
});


q.test('ReturnStatement', function (assert) {
    var falsyStr = '';
    eval(instrument('return assert(falsyStr);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "return assert(falsyStr);",
        "              |         ",
        "              \"\"        ",
        ""
    ]);
});


q.test('Identifier with falsy number', function (assert) {
    var falsyNum = 0;
    eval(instrument('assert(falsyNum);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(falsyNum);",
        "       |         ",
        "       0         ",
        ""
    ]);
});


q.test('UnaryExpression, negation', function (assert) {
    var truth = true;
    eval(instrument('assert(!truth);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(!truth);",
        "        |      ",
        "        true   ",
        ""
    ]);
});


q.test('UnaryExpression, double negative', function (assert) {
    var some = '';
    eval(instrument('assert(!!some);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(!!some);",
        "         |     ",
        "         \"\"    ",
        ""
    ]);
});


q.test('typeof operator: assert(typeof foo !== "undefined");', function (assert) {
    eval(instrument('assert(typeof foo !== \"undefined\");'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(typeof foo !== \"undefined\");",
        "                  |                ",
        "                  false            ",
        ""
    ]);
});


q.test('assert(delete foo.bar);', function (assert) {
    var foo = {
        bar: {
            baz: false
        }
    };
    eval(instrument('assert(delete foo.bar);'));
    assert.deepEqual(this.lines, [
    ]);
});


q.test('assert(fuga === piyo);', function (assert) {
    var fuga = 'foo',
        piyo = 8;
    eval(instrument('assert(fuga === piyo);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(fuga === piyo);",
        "       |    |   |     ",
        "       |    |   8     ",
        "       |    false     ",
        "       \"foo\"          ",
        ""
    ]);
});


q.test('assert(fuga !== piyo);', function (assert) {
    var fuga = 'foo',
        piyo = 'foo';
    eval(instrument('assert(fuga !== piyo);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(fuga !== piyo);",
        "       |    |   |     ",
        "       |    |   \"foo\" ",
        "       |    false     ",
        "       \"foo\"          ",
        ""
    ]);
});


q.test('BinaryExpression with Literal and Identifier: assert(fuga !== 4);', function (assert) {
    var fuga = 4;
    eval(instrument('assert(fuga !== 4);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(fuga !== 4);",
        "       |    |      ",
        "       4    false  ",
        ""
    ]);
});


q.test('assert(4 !== 4);', function (assert) {
    eval(instrument('assert(4 !== 4);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(4 !== 4);",
        "         |      ",
        "         false  ",
        ""
    ]);
});


q.test('MemberExpression: assert(ary1.length === ary2.length);', function (assert) {
    var ary1 = ['foo', 'bar'];
    var ary2 = ['aaa', 'bbb', 'ccc'];
    eval(instrument('assert(ary1.length === ary2.length);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(ary1.length === ary2.length);",
        "       |    |      |   |    |       ",
        "       |    |      |   |    3       ",
        "       |    |      |   [\"aaa\",\"bbb\",\"ccc\"]",
        "       |    2      false            ",
        "       [\"foo\",\"bar\"]                ",
        ""
    ]);
});


q.test('LogicalExpression: assert(5 < actual && actual < 13);', function (assert) {
    var actual = 16;
    eval(instrument('assert(5 < actual && actual < 13);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(5 < actual && actual < 13);",
        "         | |         |      |     ",
        "         | 16        16     false ",
        "         true                     ",
        ""
    ]);
});


q.test('LogicalExpression OR: assert.ok(actual < 5 || 13 < actual);', function (assert) {
    var actual = 10;
    eval(instrument('assert.ok(actual < 5 || 13 < actual);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert.ok(actual < 5 || 13 < actual);",
        "          |      |         | |       ",
        "          |      |         | 10      ",
        "          10     false     false     ",
        ""
    ]);
});


q.test('Characterization test of LogicalExpression current spec: assert(2 > actual && actual < 13);', function (assert) {
    var actual = 5;
    eval(instrument('assert(2 > actual && actual < 13);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(2 > actual && actual < 13);",
        "         | |                      ",
        "         | 5                      ",
        "         false                    ",
        ""
    ]);
});


q.test('Deep MemberExpression chain: assert(foo.bar.baz);', function (assert) {
    var foo = {
        bar: {
            baz: false
        }
    };
    eval(instrument('assert(foo.bar.baz);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(foo.bar.baz);",
        "       |   |   |    ",
        "       |   |   false",
        "       |   {\"baz\":false}",
        "       {\"bar\":{\"baz\":false}}",
        ""
    ]);
});


q.test('assert(func());', function (assert) {
    var func = function () { return false; };
    eval(instrument('assert(func());'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(func());",
        "       |       ",
        "       false   ",
        ""
    ]);
});


q.test('assert(obj.age());', function (assert) {
    var obj = {
        age: function () {
            return 0;
        }
    };
    eval(instrument('assert(obj.age());'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(obj.age());",
        "       |   |      ",
        "       {}  0      ",
        ""
    ]);
});


q.test('CallExpression with arguments: assert(isFalsy(positiveInt));', function (assert) {
    var isFalsy = function (arg) {
        return !(arg);
    };
    var positiveInt = 50;
    eval(instrument('assert(isFalsy(positiveInt));'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(isFalsy(positiveInt));",
        "       |       |             ",
        "       false   50            ",
        ""
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
    eval(instrument('assert(sum(one, two, three) === seven);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(sum(one, two, three) === seven);",
        "       |   |    |    |      |   |      ",
        "       |   |    |    |      |   7      ",
        "       6   1    2    3      false      ",
        ""
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
    eval(instrument('assert(sum(sum(one, two), three) === sum(sum(two, three), seven));'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(sum(sum(one, two), three) === sum(sum(two, three), seven));",
        "       |   |   |    |     |      |   |   |   |    |       |       ",
        "       |   |   |    |     |      |   12  5   2    3       7       ",
        "       6   3   1    2     3      false                            ",
        ""
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
    eval(instrument('assert(math.calc.sum(one, two, three) === seven);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(math.calc.sum(one, two, three) === seven);",
        "       |    |    |   |    |    |      |   |      ",
        "       |    |    |   |    |    |      |   7      ",
        "       |    {}   6   1    2    3      false      ",
        "       {\"calc\":{}}                               ",
        ""
    ]);
});


q.test('Nested CallExpression with BinaryExpression: assert((three * (seven * ten)) === three);', function (assert) {
    var one = 1, two = 2, three = 3, seven = 7, ten = 10;
    eval(instrument('assert((three * (seven * ten)) === three);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert((three * (seven * ten)) === three);",
        "        |     |  |     | |    |    |      ",
        "        |     |  |     | |    |    3      ",
        "        |     |  |     | 10   false       ",
        "        |     |  7     70                 ",
        "        3     210                         ",
        ""
    ]);
});


q.test('Simple BinaryExpression with comment', function (assert) {
    var hoge = 'foo';
    var fuga = 'bar';
    eval(instrument('assert.ok(hoge === fuga, \'comment\');'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert.ok(hoge === fuga, 'comment');",
        "          |    |   |                ",
        "          |    |   \"bar\"            ",
        "          |    false                ",
        "          \"foo\"                     ",
        ""
    ]);
});


q.test('Looooong string', function (assert) {
    var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    eval(instrument('assert(longString === anotherLongString);'));
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(longString === anotherLongString);",
        "       |          |   |                  ",
        "       |          |   \"yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message\"",
        "       |          false                  ",
        "       \"very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message\"",
        ""
    ]);
});
