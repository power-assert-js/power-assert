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
        var actual = empower(before, {module: 'commonjs'});
        assert.equal(actual, after, comment);
    });
};

q.module('useDefaultFormatter');

emtest(
    'assert(falsyStr);',
    [
        "var _pa_ = require('power-assert');",
        "_pa_.useDefaultFormatter();",
        "assert(_pa_.expr(_pa_.ident(falsyStr, 7, 15), 'assert(falsyStr);', 1));"
    ].join("\n")
);
