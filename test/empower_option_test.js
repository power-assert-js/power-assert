var empower = require('../lib/empower'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    q = require('qunitjs'),
    tap = (function (qu) {
        var qunitTap = require("qunit-tap").qunitTap,
            util = require('util'),
            tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
        qu.init();
        qu.config.updateRate = 0;
        return tap;
    })(q);


q.module('destructive option');

var destructiveOptionTest = function (testName, option, callback) {
    q.test(testName, function (assert) {
        var tree = esprima.parse('assert(falsyStr);', {tolerant: true, loc: true, range: true}),
            saved = empower.deepCopy(tree),
            result = empower(tree, option);
        callback(assert, saved, tree, result);
    });
};

destructiveOptionTest('default option', {}, function (assert, before, tree, after) {
    assert.deepEqual(tree, before);
    assert.notDeepEqual(after, before);
    assert.notDeepEqual(after, tree);
});

destructiveOptionTest('destructive: false', {destructive: false}, function (assert, before, tree, after) {
    assert.deepEqual(tree, before);
    assert.notDeepEqual(after, before);
    assert.notDeepEqual(after, tree);
});

destructiveOptionTest('destructive: true', {destructive: true}, function (assert, before, tree, after) {
    assert.notDeepEqual(tree, before);
    assert.notDeepEqual(after, before);
    assert.deepEqual(after, tree);
});
