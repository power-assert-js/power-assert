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
            empower.instrument(expression, line, 1);
            assert.equal(escodegen.generate(expression), after, comment);
        });
    };
})();



q.module('Identifier');

emtest(
    'assert(falsyStr);',
    "assert(_pa_.expr(_pa_.ident('falsyStr', falsyStr, 7, 15), 'assert(falsyStr);', 1))"
);
emtest(
    'assert.ok(falsyStr);',
    "assert.ok(_pa_.expr(_pa_.ident('falsyStr', falsyStr, 10, 18), 'assert.ok(falsyStr);', 1))"
);


q.module('UnaryExpression');

emtest(
    'assert(!truth);',
    "assert(_pa_.expr(!_pa_.ident('truth', truth, 8, 13), 'assert(!truth);', 1))"
);
emtest(
    'assert.ok(!truth);',
    "assert.ok(_pa_.expr(!_pa_.ident('truth', truth, 11, 16), 'assert.ok(!truth);', 1))"
);

emtest(
    'assert(!!some);',
    "assert(_pa_.expr(!!_pa_.ident('some', some, 9, 13), 'assert(!!some);', 1))"
);

emtest(
    'assert(typeof foo !== "undefined");',
    "assert(_pa_.expr(typeof foo !== 'undefined', 'assert(typeof foo !== \"undefined\");', 1))",
    '"typeof" operator is not supported'
);

emtest(
    'assert(delete foo.bar);',
    "assert(_pa_.expr(delete _pa_.ident('bar', _pa_.ident('foo', foo, 14, 17).bar, 18, 21), 'assert(delete foo.bar);', 1))"
);


q.module('BinaryExpression with Identifier');

emtest(
    'assert(fuga === piyo);',
    "assert(_pa_.expr(_pa_.ident('fuga', fuga, 7, 11) === _pa_.ident('piyo', piyo, 16, 20), 'assert(fuga === piyo);', 1))"
);
emtest(
    'assert.ok(fuga === piyo);',
    "assert.ok(_pa_.expr(_pa_.ident('fuga', fuga, 10, 14) === _pa_.ident('piyo', piyo, 19, 23), 'assert.ok(fuga === piyo);', 1))"
);
emtest(
    'assert(fuga !== piyo);',
    "assert(_pa_.expr(_pa_.ident('fuga', fuga, 7, 11) !== _pa_.ident('piyo', piyo, 16, 20), 'assert(fuga !== piyo);', 1))"
);
emtest(
    'assert.ok(fuga !== piyo);',
    "assert.ok(_pa_.expr(_pa_.ident('fuga', fuga, 10, 14) !== _pa_.ident('piyo', piyo, 19, 23), 'assert.ok(fuga !== piyo);', 1))"
);

emtest(
    'assert(fuga !== 4);',
    "assert(_pa_.expr(_pa_.ident('fuga', fuga, 7, 11) !== 4, 'assert(fuga !== 4);', 1))"
);
emtest(
    'assert.ok(fuga !== 4);',
    "assert.ok(_pa_.expr(_pa_.ident('fuga', fuga, 10, 14) !== 4, 'assert.ok(fuga !== 4);', 1))"
);

emtest(
    'assert(4 !== 4);',
    "assert(_pa_.expr(4 !== 4, 'assert(4 !== 4);', 1))"
);
emtest(
    'assert.ok(4 !== 4);',
    "assert.ok(_pa_.expr(4 !== 4, 'assert.ok(4 !== 4);', 1))"
);



q.module('BinaryExpression with MemberExpression');

emtest(
    'assert(ary1.length === ary2.length);',
    "assert(_pa_.expr(_pa_.ident('length', _pa_.ident('ary1', ary1, 7, 11).length, 12, 18) === _pa_.ident('length', _pa_.ident('ary2', ary2, 23, 27).length, 28, 34), 'assert(ary1.length === ary2.length);', 1))"
);

emtest(
    'assert.ok(ary1.length === ary2.length);',
    "assert.ok(_pa_.expr(_pa_.ident('length', _pa_.ident('ary1', ary1, 10, 14).length, 15, 21) === _pa_.ident('length', _pa_.ident('ary2', ary2, 26, 30).length, 31, 37), 'assert.ok(ary1.length === ary2.length);', 1))"
);


q.module('LogicalExpression');

emtest(
    'assert(2 > actual && actual < 13);',
    "assert(_pa_.expr(2 > _pa_.ident('actual', actual, 11, 17) && _pa_.ident('actual', actual, 21, 27) < 13, 'assert(2 > actual && actual < 13);', 1))"
);


q.module('MemberExpression Chain');

emtest(
    'assert.ok(foo.bar.baz);',
    "assert.ok(_pa_.expr(_pa_.ident('baz', _pa_.ident('bar', _pa_.ident('foo', foo, 10, 13).bar, 14, 17).baz, 18, 21), 'assert.ok(foo.bar.baz);', 1))"
);


q.module('CallExpression');
emtest(
    'assert(func());',
    "assert(_pa_.expr(_pa_.ident('func', func(), 7, 11), 'assert(func());', 1))"
);
// emtest(
//     'assert(obj.hello());',
//     ""
// );
