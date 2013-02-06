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
                tree = esprima.parse(line, {tolerant: true, loc: true});
            empower.insertPowerAssertDeclaration(tree, {module: 'commonjs'});
            assert.equal(escodegen.generate(tree), after, comment);
        });
    };
})();



q.module('useDefaultFormatter');

emtest(
    'assert(falsyStr);',
    [
        "var _pa_ = require('power-assert');",
        "_pa_.useDefaultFormatter();",
        "assert(falsyStr);"
    ].join("\n")
);
