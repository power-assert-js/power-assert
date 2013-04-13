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

var emtest = function (before, after, comment) {
    q.test(before, function (assert) {
        var tree = esprima.parse(before, {tolerant: true, loc: true});
        empower.instrument(tree, {module: 'commonjs'});
        var actual = escodegen.generate(tree, {format: {compact: true}});
        assert.equal(actual, after, comment);
    });
};

q.module('useDefault');

emtest(
    'assert(falsyStr);',
    [
        "var _pa_=require('power-assert');",
        "_pa_.useDefault();",
        "assert(_pa_.expr(_pa_.ident(falsyStr,{start:{line:1,column:7},end:{line:1,column:15}}),{start:{line:1,column:7},end:{line:1,column:15}}));"
    ].join('')
);
