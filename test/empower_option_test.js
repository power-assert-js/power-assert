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



q.module('module option');

q.test('module: commonjs', function (assert) {
    var option = {module: 'commonjs'},
        tree = esprima.parse('assert(falsyStr);', {tolerant: true, loc: true, range: true}),
        result = empower.instrument(tree, option),
        actual = escodegen.generate(result, {format: {compact: true}}),
        expected = [
            "var _pa_=require('power-assert');",
            "_pa_.useDefault();",
            "assert(_pa_.expr(_pa_.ident(falsyStr,{start:{line:1,column:7}}),{start:{line:1,column:7}}));"
        ].join('');
    assert.equal(actual, expected);
});



q.module('destructive option');

var destructiveOptionTest = function (testName, option, callback) {
    q.test(testName, function (assert) {
        var tree = esprima.parse('assert(falsyStr);', {tolerant: true, loc: true, range: true}),
            saved = empower.deepCopy(tree),
            result = empower.instrument(tree, option);
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
