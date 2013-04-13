var empower = require('../lib/empower'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    q = require('qunitjs'),
    util = require('util');

(function (qu) {
    var qunitTap = require("qunit-tap").qunitTap;
    var tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
    qu.init();
    qu.config.updateRate = 0;
})(q);

var emtest = (function () {
    var extractExpressionFrom = function (string) {
        var tree = esprima.parse(string, {tolerant: true, loc: true}),
            expressionStatement = tree.body[0],
            expression = expressionStatement.expression;
        return expression;
    };
    return function (before, after, comment) {
        q.test(before, function (assert) {
            var line = before,
                expression = extractExpressionFrom(line);
            empower.instrumentExpression(expression, {module: 'commonjs', strategy: 'inline', source: line});
            var actual = escodegen.generate(expression, {format: {compact: true}});
            assert.equal(actual, after, comment);
        });
    };
})();



q.module('Identifier');
emtest(
    'assert(falsyStr);',
    "assert(_pa_.expr(_pa_.ident(falsyStr,{start:{line:1,column:7},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:15}},'assert(falsyStr);'))"
);
emtest(
    'assert.ok(falsyStr);',
    "assert.ok(_pa_.expr(_pa_.ident(falsyStr,{start:{line:1,column:10},end:{line:1,column:18}}),{start:{line:1,column:10},end:{line:1,column:18}},'assert.ok(falsyStr);'))"
);
emtest(
    'console.assert(falsyStr);',
    "console.assert(_pa_.expr(_pa_.ident(falsyStr,{start:{line:1,column:15},end:{line:1,column:23}}),{start:{line:1,column:15},end:{line:1,column:23}},'console.assert(falsyStr);'))"
);

q.module('UnaryExpression');
emtest(
    'assert(!truth);',
    "assert(_pa_.expr(!_pa_.ident(truth,{start:{line:1,column:8},end:{line:1,column:13}}),{start:{line:1,column:7},end:{line:1,column:13}},'assert(!truth);'))"
);
emtest(
    'assert(!!some);',
    "assert(_pa_.expr(!!_pa_.ident(some,{start:{line:1,column:9},end:{line:1,column:13}}),{start:{line:1,column:7},end:{line:1,column:13}},'assert(!!some);'))"
);
emtest(
    'assert(typeof foo !== "undefined");',
    "assert(_pa_.expr(_pa_.binary(typeof foo!=='undefined',{start:{line:1,column:18},end:{line:1,column:21}}),{start:{line:1,column:7},end:{line:1,column:33}},'assert(typeof foo !== \"undefined\");'))",
    '"typeof" operator is not supported'
);
emtest(
    'assert(delete foo.bar);',
    "assert(_pa_.expr(delete _pa_.ident(_pa_.ident(foo,{start:{line:1,column:14},end:{line:1,column:17}}).bar,{start:{line:1,column:18},end:{line:1,column:21}}),{start:{line:1,column:7},end:{line:1,column:21}},'assert(delete foo.bar);'))"
);

q.module('BinaryExpression with Identifier');
emtest(
    'assert(fuga === piyo);',
    "assert(_pa_.expr(_pa_.binary(_pa_.ident(fuga,{start:{line:1,column:7},end:{line:1,column:11}})===_pa_.ident(piyo,{start:{line:1,column:16},end:{line:1,column:20}}),{start:{line:1,column:12},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:20}},'assert(fuga === piyo);'))"
);
emtest(
    'assert(longString === anotherLongString);',
    "assert(_pa_.expr(_pa_.binary(_pa_.ident(longString,{start:{line:1,column:7},end:{line:1,column:17}})===_pa_.ident(anotherLongString,{start:{line:1,column:22},end:{line:1,column:39}}),{start:{line:1,column:18},end:{line:1,column:21}}),{start:{line:1,column:7},end:{line:1,column:39}},'assert(longString === anotherLongString);'))"
);
emtest(
    'assert(fuga !== piyo);',
    "assert(_pa_.expr(_pa_.binary(_pa_.ident(fuga,{start:{line:1,column:7},end:{line:1,column:11}})!==_pa_.ident(piyo,{start:{line:1,column:16},end:{line:1,column:20}}),{start:{line:1,column:12},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:20}},'assert(fuga !== piyo);'))"
);
emtest(
    'assert(fuga !== 4);',
    "assert(_pa_.expr(_pa_.binary(_pa_.ident(fuga,{start:{line:1,column:7},end:{line:1,column:11}})!==4,{start:{line:1,column:12},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:17}},'assert(fuga !== 4);'))"
);
emtest(
    'assert(4 !== 4);',
    "assert(_pa_.expr(_pa_.binary(4!==4,{start:{line:1,column:9},end:{line:1,column:12}}),{start:{line:1,column:7},end:{line:1,column:14}},'assert(4 !== 4);'))"
);

q.module('BinaryExpression with Comment');
emtest(
    "assert.ok(hoge === fuga, 'comment');",
    "assert.ok(_pa_.expr(_pa_.binary(_pa_.ident(hoge,{start:{line:1,column:10},end:{line:1,column:14}})===_pa_.ident(fuga,{start:{line:1,column:19},end:{line:1,column:23}}),{start:{line:1,column:15},end:{line:1,column:18}}),{start:{line:1,column:10},end:{line:1,column:23}},'assert.ok(hoge === fuga, \\'comment\\');'),'comment')"
);


q.module('BinaryExpression with MemberExpression');
emtest(
    'assert(ary1.length === ary2.length);',
    "assert(_pa_.expr(_pa_.binary(_pa_.ident(_pa_.ident(ary1,{start:{line:1,column:7},end:{line:1,column:11}}).length,{start:{line:1,column:12},end:{line:1,column:18}})===_pa_.ident(_pa_.ident(ary2,{start:{line:1,column:23},end:{line:1,column:27}}).length,{start:{line:1,column:28},end:{line:1,column:34}}),{start:{line:1,column:19},end:{line:1,column:22}}),{start:{line:1,column:7},end:{line:1,column:34}},'assert(ary1.length === ary2.length);'))"
);

q.module('LogicalExpression');
emtest(
    'assert(2 > actual && actual < 13);',
    "assert(_pa_.expr(_pa_.binary(2>_pa_.ident(actual,{start:{line:1,column:11},end:{line:1,column:17}}),{start:{line:1,column:9},end:{line:1,column:10}})&&_pa_.binary(_pa_.ident(actual,{start:{line:1,column:21},end:{line:1,column:27}})<13,{start:{line:1,column:28},end:{line:1,column:29}}),{start:{line:1,column:7},end:{line:1,column:32}},'assert(2 > actual && actual < 13);'))"
);

emtest(
    'assert(5 < actual && actual < 13);',
    "assert(_pa_.expr(_pa_.binary(5<_pa_.ident(actual,{start:{line:1,column:11},end:{line:1,column:17}}),{start:{line:1,column:9},end:{line:1,column:10}})&&_pa_.binary(_pa_.ident(actual,{start:{line:1,column:21},end:{line:1,column:27}})<13,{start:{line:1,column:28},end:{line:1,column:29}}),{start:{line:1,column:7},end:{line:1,column:32}},'assert(5 < actual && actual < 13);'))"
);

emtest(
    'assert.ok(actual < 5 || 13 < actual);',
    "assert.ok(_pa_.expr(_pa_.binary(_pa_.ident(actual,{start:{line:1,column:10},end:{line:1,column:16}})<5,{start:{line:1,column:17},end:{line:1,column:18}})||_pa_.binary(13<_pa_.ident(actual,{start:{line:1,column:29},end:{line:1,column:35}}),{start:{line:1,column:27},end:{line:1,column:28}}),{start:{line:1,column:10},end:{line:1,column:35}},'assert.ok(actual < 5 || 13 < actual);'))"
);



q.module('MemberExpression Chain');
emtest(
    'assert(foo.bar.baz);',
    "assert(_pa_.expr(_pa_.ident(_pa_.ident(_pa_.ident(foo,{start:{line:1,column:7},end:{line:1,column:10}}).bar,{start:{line:1,column:11},end:{line:1,column:14}}).baz,{start:{line:1,column:15},end:{line:1,column:18}}),{start:{line:1,column:7},end:{line:1,column:18}},'assert(foo.bar.baz);'))"
);

q.module('CallExpression');
emtest(
    'assert(func());',
    "assert(_pa_.expr(_pa_.funcall(func(),{start:{line:1,column:7},end:{line:1,column:13}}),{start:{line:1,column:7},end:{line:1,column:13}},'assert(func());'))"
);
emtest(
    'assert(obj.age());',
    "assert(_pa_.expr(_pa_.funcall(_pa_.ident(obj,{start:{line:1,column:7},end:{line:1,column:10}}).age(),{start:{line:1,column:11},end:{line:1,column:14}}),{start:{line:1,column:7},end:{line:1,column:16}},'assert(obj.age());'))"
);
emtest(
    'assert(isFalsy(positiveInt));',
    "assert(_pa_.expr(_pa_.funcall(isFalsy(_pa_.ident(positiveInt,{start:{line:1,column:15},end:{line:1,column:26}})),{start:{line:1,column:7},end:{line:1,column:27}}),{start:{line:1,column:7},end:{line:1,column:27}},'assert(isFalsy(positiveInt));'))"
);
emtest(
    'assert(sum(one, two, three) === seven);',
    "assert(_pa_.expr(_pa_.binary(_pa_.funcall(sum(_pa_.ident(one,{start:{line:1,column:11},end:{line:1,column:14}}),_pa_.ident(two,{start:{line:1,column:16},end:{line:1,column:19}}),_pa_.ident(three,{start:{line:1,column:21},end:{line:1,column:26}})),{start:{line:1,column:7},end:{line:1,column:27}})===_pa_.ident(seven,{start:{line:1,column:32},end:{line:1,column:37}}),{start:{line:1,column:28},end:{line:1,column:31}}),{start:{line:1,column:7},end:{line:1,column:37}},'assert(sum(one, two, three) === seven);'))"
);
emtest(
    'assert(sum(sum(one, two), three) === sum(sum(two, three), seven));',
    "assert(_pa_.expr(_pa_.binary(_pa_.funcall(sum(_pa_.funcall(sum(_pa_.ident(one,{start:{line:1,column:15},end:{line:1,column:18}}),_pa_.ident(two,{start:{line:1,column:20},end:{line:1,column:23}})),{start:{line:1,column:11},end:{line:1,column:24}}),_pa_.ident(three,{start:{line:1,column:26},end:{line:1,column:31}})),{start:{line:1,column:7},end:{line:1,column:32}})===_pa_.funcall(sum(_pa_.funcall(sum(_pa_.ident(two,{start:{line:1,column:45},end:{line:1,column:48}}),_pa_.ident(three,{start:{line:1,column:50},end:{line:1,column:55}})),{start:{line:1,column:41},end:{line:1,column:56}}),_pa_.ident(seven,{start:{line:1,column:58},end:{line:1,column:63}})),{start:{line:1,column:37},end:{line:1,column:64}}),{start:{line:1,column:33},end:{line:1,column:36}}),{start:{line:1,column:7},end:{line:1,column:64}},'assert(sum(sum(one, two), three) === sum(sum(two, three), seven));'))"
);
emtest(
    'assert(math.calc.sum(one, two, three) === seven);',
    "assert(_pa_.expr(_pa_.binary(_pa_.funcall(_pa_.ident(_pa_.ident(math,{start:{line:1,column:7},end:{line:1,column:11}}).calc,{start:{line:1,column:12},end:{line:1,column:16}}).sum(_pa_.ident(one,{start:{line:1,column:21},end:{line:1,column:24}}),_pa_.ident(two,{start:{line:1,column:26},end:{line:1,column:29}}),_pa_.ident(three,{start:{line:1,column:31},end:{line:1,column:36}})),{start:{line:1,column:17},end:{line:1,column:20}})===_pa_.ident(seven,{start:{line:1,column:42},end:{line:1,column:47}}),{start:{line:1,column:38},end:{line:1,column:41}}),{start:{line:1,column:7},end:{line:1,column:47}},'assert(math.calc.sum(one, two, three) === seven);'))"
);
emtest(
    'assert((three * (seven * ten)) === three);',
    "assert(_pa_.expr(_pa_.binary(_pa_.binary(_pa_.ident(three,{start:{line:1,column:8},end:{line:1,column:13}})*_pa_.binary(_pa_.ident(seven,{start:{line:1,column:17},end:{line:1,column:22}})*_pa_.ident(ten,{start:{line:1,column:25},end:{line:1,column:28}}),{start:{line:1,column:23},end:{line:1,column:24}}),{start:{line:1,column:14},end:{line:1,column:16}})===_pa_.ident(three,{start:{line:1,column:35},end:{line:1,column:40}}),{start:{line:1,column:30},end:{line:1,column:34}}),{start:{line:1,column:7},end:{line:1,column:40}},'assert((three * (seven * ten)) === three);'))"
);
