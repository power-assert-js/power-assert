var pagen = require('../lib/power-assert-gen'),
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

var instr = (function () {
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
            pagen.instrument(expression, line);
            assert.equal(escodegen.generate(expression), after);
        });
    };
})();



q.module('Identifier');

instr(
    'assert(falsyStr);',
    "assert(passert.__expr__(passert.__ident__('falsyStr', falsyStr, 7, 15), 'assert(falsyStr);'))"
);

instr(
    'assert.ok(falsyStr);',
    "assert.ok(passert.__expr__(passert.__ident__('falsyStr', falsyStr, 10, 18), 'assert.ok(falsyStr);'))"
);



q.module('BinaryExpression with Identifier');

instr(
    'assert(fuga === piyo);',
    "assert(passert.__expr__(passert.__ident__('fuga', fuga, 7, 11) === passert.__ident__('piyo', piyo, 16, 20), 'assert(fuga === piyo);'))"
);
instr(
    'assert.ok(fuga === piyo);',
    "assert.ok(passert.__expr__(passert.__ident__('fuga', fuga, 10, 14) === passert.__ident__('piyo', piyo, 19, 23), 'assert.ok(fuga === piyo);'))"
);
instr(
    'assert(fuga !== piyo);',
    "assert(passert.__expr__(passert.__ident__('fuga', fuga, 7, 11) !== passert.__ident__('piyo', piyo, 16, 20), 'assert(fuga !== piyo);'))"
);
instr(
    'assert.ok(fuga !== piyo);',
    "assert.ok(passert.__expr__(passert.__ident__('fuga', fuga, 10, 14) !== passert.__ident__('piyo', piyo, 19, 23), 'assert.ok(fuga !== piyo);'))"
);

instr(
    'assert(fuga !== 4);',
    "assert(passert.__expr__(passert.__ident__('fuga', fuga, 7, 11) !== 4, 'assert(fuga !== 4);'))"
);
instr(
    'assert.ok(fuga !== 4);',
    "assert.ok(passert.__expr__(passert.__ident__('fuga', fuga, 10, 14) !== 4, 'assert.ok(fuga !== 4);'))"
);

instr(
    'assert(4 !== 4);',
    "assert(passert.__expr__(4 !== 4, 'assert(4 !== 4);'))"
);
instr(
    'assert.ok(4 !== 4);',
    "assert.ok(passert.__expr__(4 !== 4, 'assert.ok(4 !== 4);'))"
);



q.module('BinaryExpression with MemberExpression');

instr(
    'assert(ary1.length === ary2.length);',
    "assert(passert.__expr__(passert.__ident__('length', passert.__ident__('ary1', ary1, 7, 11).length, 12, 18) === passert.__ident__('length', passert.__ident__('ary2', ary2, 23, 27).length, 28, 34), 'assert(ary1.length === ary2.length);'))"
);

instr(
    'assert.ok(ary1.length === ary2.length);',
    "assert.ok(passert.__expr__(passert.__ident__('length', passert.__ident__('ary1', ary1, 10, 14).length, 15, 21) === passert.__ident__('length', passert.__ident__('ary2', ary2, 26, 30).length, 31, 37), 'assert.ok(ary1.length === ary2.length);'))"
);


q.module('LogicalExpression');

instr(
    'assert(2 > actual && actual < 13);',
    ""
);
