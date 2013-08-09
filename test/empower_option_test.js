var q = require('../test_helper').QUnit,
    instrument = require('../test_helper').instrument,
    formatter = require('../lib/power-assert-formatter'),
    enhancer = require('../lib/power-assert-core'),
    powerAssertTextLines = [],
    _pa_ = enhancer(q.assert, formatter, function (context, message) {
        powerAssertTextLines = formatter.format(context);
    }),
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


q.module('path option', {
    setup: function () {
        powerAssertTextLines.length = 0;
    }
});

q.test('when path option is undefined', function (assert) {
    var falsyStr = '';
    _pa_.ok(eval(instrument('assert(falsyStr);', {destructive: false, source: 'assert(falsyStr);', powerAssertVariableName: '_pa_'})));
    assert.deepEqual(powerAssertTextLines, [
        '# at line: 1',
        '',
        'assert(falsyStr);',
        '       |         ',
        '       ""        ',
        ''
    ]);
});

q.test('when path option is provided', function (assert) {
    var falsyStr = '';
    _pa_.ok(eval(instrument('assert(falsyStr);', {destructive: false, source: 'assert(falsyStr);', path: '/path/to/source.js', powerAssertVariableName: '_pa_'})));
    assert.deepEqual(powerAssertTextLines, [
        '# /path/to/source.js:1',
        '',
        'assert(falsyStr);',
        '       |         ',
        '       ""        ',
        ''
    ]);
});



q.module('AST prerequisites. Error should be thrown if loc is missing.', {
    setup: function () {
        this.jsCode = 'assert(falsyStr);',
        this.tree = esprima.parse(this.jsCode, {tolerant: true, loc: false});
    }
});

q.test('Error content (without path)', function (assert) {
    try {
        empower(this.tree, {destructive: false, source: this.jsCode, powerAssertVariableName: '_pa_'});
        assert.ok(false, 'Error should be thrown');
    } catch (e) {
        assert.equal(e.name, 'Error');
        assert.equal(e.message, 'JavaScript AST should contain location information.');
    }
});

q.test('Error content (with path)', function (assert) {
    try {
        empower(this.tree, {destructive: false, source: this.jsCode, path: '/path/to/baz_test.js', powerAssertVariableName: '_pa_'});
        assert.ok(false, 'Error should be thrown');
    } catch (e) {
        assert.equal(e.name, 'Error');
        assert.equal(e.message, 'JavaScript AST should contain location information. path: /path/to/baz_test.js');
    }
});



q.module('preserve location information');

q.test('preserve location of instrumented nodes', function (assert) {
    var tree = esprima.parse('assert((three * (seven * ten)) === three);', {tolerant: true, loc: true, range: true}),
        saved = empower.deepCopy(tree),
        result = empower(tree, {destructive: false, source: this.jsCode, path: '/path/to/baz_test.js'});
    empower.traverse(result, function (node) {
        if (typeof node.type === 'undefined') {
            return;
        }
        assert.ok(typeof node.loc !== 'undefined', 'type: ' + node.type);
        assert.ok(typeof node.range !== 'undefined', 'type: ' + node.type);
    });
});

