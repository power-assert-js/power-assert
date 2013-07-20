var q = require('../test_helper').QUnit,
    _pa_ = require('../lib/module').useDefault(),
    instrument = require('../test_helper').instrument,
    empower = require('../lib/empower'),
    esprima = require('esprima');


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
