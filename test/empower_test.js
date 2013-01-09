var empower = require('../lib/empower'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    q = require('qunitjs'),
    util = require('util'),
    fs = require('fs'),
    path = require('path');

(function (qu) {
    var qunitTap = require("qunit-tap").qunitTap;
    qunitTap(qu, util.puts, {noPlan: true, showSourceOnFailure: false});
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
    return function (before, after) {
        q.test(before, function (assert) {
            var line = before,
                expression = extractExpressionFrom(line);
            empower.instrument(expression, line);
            assert.equal(escodegen.generate(expression), after);
        });
    };
})();



q.module('Identifier');

emtest(
    'assert(falsyStr);',
    "assert(_pa_.expr(_pa_.ident('falsyStr', falsyStr, 7, 15), 'assert(falsyStr);'))"
);
emtest(
    'assert.ok(falsyStr);',
    "assert.ok(_pa_.expr(_pa_.ident('falsyStr', falsyStr, 10, 18), 'assert.ok(falsyStr);'))"
);


q.module('UnaryExpression');

emtest(
    'assert(!truth);',
    "assert(_pa_.expr(!_pa_.ident('truth', truth, 8, 13), 'assert(!truth);'))"
);
emtest(
    'assert.ok(!truth);',
    "assert.ok(_pa_.expr(!_pa_.ident('truth', truth, 11, 16), 'assert.ok(!truth);'))"
);



q.module('BinaryExpression with Identifier');

emtest(
    'assert(fuga === piyo);',
    "assert(_pa_.expr(_pa_.ident('fuga', fuga, 7, 11) === _pa_.ident('piyo', piyo, 16, 20), 'assert(fuga === piyo);'))"
);
emtest(
    'assert.ok(fuga === piyo);',
    "assert.ok(_pa_.expr(_pa_.ident('fuga', fuga, 10, 14) === _pa_.ident('piyo', piyo, 19, 23), 'assert.ok(fuga === piyo);'))"
);
emtest(
    'assert(fuga !== piyo);',
    "assert(_pa_.expr(_pa_.ident('fuga', fuga, 7, 11) !== _pa_.ident('piyo', piyo, 16, 20), 'assert(fuga !== piyo);'))"
);
emtest(
    'assert.ok(fuga !== piyo);',
    "assert.ok(_pa_.expr(_pa_.ident('fuga', fuga, 10, 14) !== _pa_.ident('piyo', piyo, 19, 23), 'assert.ok(fuga !== piyo);'))"
);

emtest(
    'assert(fuga !== 4);',
    "assert(_pa_.expr(_pa_.ident('fuga', fuga, 7, 11) !== 4, 'assert(fuga !== 4);'))"
);
emtest(
    'assert.ok(fuga !== 4);',
    "assert.ok(_pa_.expr(_pa_.ident('fuga', fuga, 10, 14) !== 4, 'assert.ok(fuga !== 4);'))"
);

emtest(
    'assert(4 !== 4);',
    "assert(_pa_.expr(4 !== 4, 'assert(4 !== 4);'))"
);
emtest(
    'assert.ok(4 !== 4);',
    "assert.ok(_pa_.expr(4 !== 4, 'assert.ok(4 !== 4);'))"
);



q.module('BinaryExpression with MemberExpression');

emtest(
    'assert(ary1.length === ary2.length);',
    "assert(_pa_.expr(_pa_.ident('length', _pa_.ident('ary1', ary1, 7, 11).length, 12, 18) === _pa_.ident('length', _pa_.ident('ary2', ary2, 23, 27).length, 28, 34), 'assert(ary1.length === ary2.length);'))"
);

emtest(
    'assert.ok(ary1.length === ary2.length);',
    "assert.ok(_pa_.expr(_pa_.ident('length', _pa_.ident('ary1', ary1, 10, 14).length, 15, 21) === _pa_.ident('length', _pa_.ident('ary2', ary2, 26, 30).length, 31, 37), 'assert.ok(ary1.length === ary2.length);'))"
);


q.module('LogicalExpression');

emtest(
    'assert(2 > actual && actual < 13);',
    "assert(_pa_.expr(2 > _pa_.ident('actual', actual, 11, 17) && _pa_.ident('actual', actual, 21, 27) < 13, 'assert(2 > actual && actual < 13);'))"
);


q.module('MemberExpression Chain');

q.test('member chain', function (assert) {
    var foo = {
        bar: {
            baz: 'Hi'
        }
    };
    var hoge = {
        fuga: {
            piyo: 'Hi'
        }
    };
    var pa = {
        cap: function (val) {
            return val;
        }
    };
    assert.ok(pa.cap(pa.cap(pa.cap(foo).bar).baz) === hoge.fuga.piyo);
});

emtest(
    'assert.ok(foo.bar.baz);',
    "assert.ok(_pa_.expr(_pa_.ident('baz', _pa_.ident('bar', _pa_.ident('foo', foo, 10, 13).bar, 14, 17).baz, 18, 21), 'assert.ok(foo.bar.baz);'))"
);
