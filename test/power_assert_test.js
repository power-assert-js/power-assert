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


q.test('Identifier with empty string', function (assert) {
    var falsyStr = '';
    _pa_.expr(_pa_.ident(falsyStr,{start:{line:1,column:7},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:15}},'assert(falsyStr);');
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(falsyStr);",
        "       |         ",
        "       \"\"        ",
        ""
    ]);
});


q.test('Identifier with falsy number', function (assert) {
    var falsyNum = 0;
    _pa_.expr(_pa_.ident(falsyNum,{start:{line:1,column:7},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:15}},'assert(falsyStr);');
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(falsyStr);",
        "       |         ",
        "       0         ",
        ""
    ]);
});


q.test('UnaryExpression, negation', function (assert) {
    var truth = true;
    _pa_.expr(!_pa_.ident(truth,{start:{line:1,column:8},end:{line:1,column:13}}),{start:{line:1,column:7},end:{line:1,column:13}},'assert(!truth);');
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
    _pa_.expr(!!_pa_.ident(some,{start:{line:1,column:9},end:{line:1,column:13}}),{start:{line:1,column:7},end:{line:1,column:13}},'assert(!!some);');
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(!!some);",
        "         |     ",
        "         \"\"    ",
        ""
    ]);
});

q.test('typeof operator: assert(typeof foo !== "undefined");', function (assert) {
    _pa_.expr(_pa_.binary(typeof foo!=='undefined',{start:{line:1,column:18},end:{line:1,column:21}}),{start:{line:1,column:7},end:{line:1,column:33}},'assert(typeof foo !== \"undefined\");');
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
    _pa_.expr(delete _pa_.ident(_pa_.ident(foo,{start:{line:1,column:14},end:{line:1,column:17}}).bar,{start:{line:1,column:18},end:{line:1,column:21}}),{start:{line:1,column:7},end:{line:1,column:21}},'assert(delete foo.bar);');
    assert.deepEqual(this.lines, [
    ]);
});

q.test('assert(fuga === piyo);', function (assert) {
    var fuga = 'foo',
        piyo = 8;
    _pa_.expr(_pa_.binary(_pa_.ident(fuga,{start:{line:1,column:7},end:{line:1,column:11}})===_pa_.ident(piyo,{start:{line:1,column:16},end:{line:1,column:20}}),{start:{line:1,column:12},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:20}},'assert(fuga === piyo);');
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
    _pa_.expr(_pa_.binary(_pa_.ident(fuga,{start:{line:1,column:7},end:{line:1,column:11}})!==_pa_.ident(piyo,{start:{line:1,column:16},end:{line:1,column:20}}),{start:{line:1,column:12},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:20}},'assert(fuga !== piyo);');
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
    _pa_.expr(_pa_.binary(_pa_.ident(fuga,{start:{line:1,column:7},end:{line:1,column:11}})!==4,{start:{line:1,column:12},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:17}},'assert(fuga !== 4);');
    assert.deepEqual(this.lines, [
        "# at line: 1",
        "assert(fuga !== 4);",
        "       |    |      ",
        "       4    false  ",
        ""
    ]);
});

q.test('assert(4 !== 4);', function (assert) {
    _pa_.expr(_pa_.binary(4!==4,{start:{line:1,column:9},end:{line:1,column:12}}),{start:{line:1,column:7},end:{line:1,column:14}},'assert(4 !== 4);');
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
    _pa_.expr(_pa_.binary(_pa_.ident(_pa_.ident(ary1,{start:{line:1,column:7},end:{line:1,column:11}}).length,{start:{line:1,column:12},end:{line:1,column:18}})===_pa_.ident(_pa_.ident(ary2,{start:{line:1,column:23},end:{line:1,column:27}}).length,{start:{line:1,column:28},end:{line:1,column:34}}),{start:{line:1,column:19},end:{line:1,column:22}}),{start:{line:1,column:7},end:{line:1,column:34}},'assert(ary1.length === ary2.length);');
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
    _pa_.expr(_pa_.binary(5<_pa_.ident(actual,{start:{line:1,column:11},end:{line:1,column:17}}),{start:{line:1,column:9},end:{line:1,column:10}})&&_pa_.binary(_pa_.ident(actual,{start:{line:1,column:21},end:{line:1,column:27}})<13,{start:{line:1,column:28},end:{line:1,column:29}}),{start:{line:1,column:7},end:{line:1,column:32}},'assert(5 < actual && actual < 13);');
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
    _pa_.expr(_pa_.binary(_pa_.ident(actual,{start:{line:1,column:10},end:{line:1,column:16}})<5,{start:{line:1,column:17},end:{line:1,column:18}})||_pa_.binary(13<_pa_.ident(actual,{start:{line:1,column:29},end:{line:1,column:35}}),{start:{line:1,column:27},end:{line:1,column:28}}),{start:{line:1,column:10},end:{line:1,column:35}},'assert.ok(actual < 5 || 13 < actual);');
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
    _pa_.expr(_pa_.binary(2>_pa_.ident(actual,{start:{line:1,column:11},end:{line:1,column:17}}),{start:{line:1,column:9},end:{line:1,column:10}})&&_pa_.binary(_pa_.ident(actual,{start:{line:1,column:21},end:{line:1,column:27}})<13,{start:{line:1,column:28},end:{line:1,column:29}}),{start:{line:1,column:7},end:{line:1,column:32}},'assert(2 > actual && actual < 13);');
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
    _pa_.expr(_pa_.ident(_pa_.ident(_pa_.ident(foo,{start:{line:1,column:7},end:{line:1,column:10}}).bar,{start:{line:1,column:11},end:{line:1,column:14}}).baz,{start:{line:1,column:15},end:{line:1,column:18}}),{start:{line:1,column:7},end:{line:1,column:18}},'assert(foo.bar.baz);');
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
    _pa_.expr(_pa_.funcall(func(),{start:{line:1,column:7},end:{line:1,column:13}}),{start:{line:1,column:7},end:{line:1,column:13}},'assert(func());');
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
    _pa_.expr(_pa_.funcall(_pa_.ident(obj,{start:{line:1,column:7},end:{line:1,column:10}}).age(),{start:{line:1,column:11},end:{line:1,column:14}}),{start:{line:1,column:7},end:{line:1,column:16}},'assert(obj.age());');
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
    _pa_.expr(_pa_.funcall(isFalsy(_pa_.ident(positiveInt,{start:{line:1,column:15},end:{line:1,column:26}})),{start:{line:1,column:7},end:{line:1,column:27}}),{start:{line:1,column:7},end:{line:1,column:27}},'assert(isFalsy(positiveInt));');
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
    _pa_.expr(_pa_.binary(_pa_.funcall(sum(_pa_.ident(one,{start:{line:1,column:11},end:{line:1,column:14}}),_pa_.ident(two,{start:{line:1,column:16},end:{line:1,column:19}}),_pa_.ident(three,{start:{line:1,column:21},end:{line:1,column:26}})),{start:{line:1,column:7},end:{line:1,column:27}})===_pa_.ident(seven,{start:{line:1,column:32},end:{line:1,column:37}}),{start:{line:1,column:28},end:{line:1,column:31}}),{start:{line:1,column:7},end:{line:1,column:37}},'assert(sum(one, two, three) === seven);');
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
    _pa_.expr(_pa_.binary(_pa_.funcall(sum(_pa_.funcall(sum(_pa_.ident(one,{start:{line:1,column:15},end:{line:1,column:18}}),_pa_.ident(two,{start:{line:1,column:20},end:{line:1,column:23}})),{start:{line:1,column:11},end:{line:1,column:24}}),_pa_.ident(three,{start:{line:1,column:26},end:{line:1,column:31}})),{start:{line:1,column:7},end:{line:1,column:32}})===_pa_.funcall(sum(_pa_.funcall(sum(_pa_.ident(two,{start:{line:1,column:45},end:{line:1,column:48}}),_pa_.ident(three,{start:{line:1,column:50},end:{line:1,column:55}})),{start:{line:1,column:41},end:{line:1,column:56}}),_pa_.ident(seven,{start:{line:1,column:58},end:{line:1,column:63}})),{start:{line:1,column:37},end:{line:1,column:64}}),{start:{line:1,column:33},end:{line:1,column:36}}),{start:{line:1,column:7},end:{line:1,column:64}},'assert(sum(sum(one, two), three) === sum(sum(two, three), seven));');
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
    _pa_.expr(_pa_.binary(_pa_.funcall(_pa_.ident(_pa_.ident(math,{start:{line:1,column:7},end:{line:1,column:11}}).calc,{start:{line:1,column:12},end:{line:1,column:16}}).sum(_pa_.ident(one,{start:{line:1,column:21},end:{line:1,column:24}}),_pa_.ident(two,{start:{line:1,column:26},end:{line:1,column:29}}),_pa_.ident(three,{start:{line:1,column:31},end:{line:1,column:36}})),{start:{line:1,column:17},end:{line:1,column:20}})===_pa_.ident(seven,{start:{line:1,column:42},end:{line:1,column:47}}),{start:{line:1,column:38},end:{line:1,column:41}}),{start:{line:1,column:7},end:{line:1,column:47}},'assert(math.calc.sum(one, two, three) === seven);');
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
    _pa_.expr(_pa_.binary(_pa_.binary(_pa_.ident(three,{start:{line:1,column:8},end:{line:1,column:13}})*_pa_.binary(_pa_.ident(seven,{start:{line:1,column:17},end:{line:1,column:22}})*_pa_.ident(ten,{start:{line:1,column:25},end:{line:1,column:28}}),{start:{line:1,column:23},end:{line:1,column:24}}),{start:{line:1,column:14},end:{line:1,column:16}})===_pa_.ident(three,{start:{line:1,column:35},end:{line:1,column:40}}),{start:{line:1,column:30},end:{line:1,column:34}}),{start:{line:1,column:7},end:{line:1,column:40}},'assert((three * (seven * ten)) === three);');
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
    _pa_.expr(_pa_.binary(_pa_.ident(hoge,{start:{line:1,column:10},end:{line:1,column:14}})===_pa_.ident(fuga,{start:{line:1,column:19},end:{line:1,column:23}}),{start:{line:1,column:15},end:{line:1,column:18}}),{start:{line:1,column:10},end:{line:1,column:23}},'assert.ok(hoge === fuga, \'comment\');');
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
    _pa_.expr(_pa_.binary(_pa_.ident(longString,{start:{line:1,column:7},end:{line:1,column:17}})===_pa_.ident(anotherLongString,{start:{line:1,column:22},end:{line:1,column:39}}),{start:{line:1,column:18},end:{line:1,column:21}}),{start:{line:1,column:7},end:{line:1,column:39}},'assert(longString === anotherLongString);');
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
