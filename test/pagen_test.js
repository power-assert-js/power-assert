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

q.module('instrument');

instr(
    'assert(fuga === piyo);',
    "assert(passert.__expr__(passert.__ident__('fuga', fuga, 7, 11) === passert.__ident__('piyo', piyo, 16, 20), 'assert(fuga === piyo);'))"
);

instr(
    'assert.ok(fuga === piyo);',
    "assert.ok(passert.__expr__(passert.__ident__('fuga', fuga, 10, 14) === passert.__ident__('piyo', piyo, 19, 23), 'assert.ok(fuga === piyo);'))"
);

instr(
    'assert.ok(4 !== 4);',
    "assert.ok(passert.__expr__(4 !== 4, 'assert.ok(4 !== 4);'))"
);
