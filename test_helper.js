var espower = require('./lib/espower'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    q = require('qunitjs');

(function (qu) {
    if (!q.config.done.some(function (callback) { return callback.name === 'gruntQunitTaskDone'; })) {
        var qunitTap = require("qunit-tap"),
            util = require('util'),
            tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
        qu.init();
        qu.config.updateRate = 0;
    }
})(q);


var instrument = function () {
    var extractBodyFrom = function (source) {
        var tree = esprima.parse(source, {tolerant: true, loc: true, range: true});
        return tree.body[0];
    };
    var extractBodyOfAssertionAsCode = function (node) {
        var expression;
        if (node.type === 'ExpressionStatement') {
            expression = node.expression;
        } else if (node.type === 'ReturnStatement') {
            expression = node.argument;
        }
        return escodegen.generate(expression.arguments[0], {format: {compact: true}});
    };
    return function (line, options) {
        options = options || {destructive: false, source: line, path: '/path/to/some_test.js', powerAssertVariableName: '_pa_'};
        var tree = extractBodyFrom(line);
        var result = espower(tree, options);

        // espower.traverse(result, function (node) {
        //     if (typeof node.type === 'undefined') {
        //         return;
        //     }
        //     q.assert.ok(typeof node.loc !== 'undefined', 'type: ' + node.type);
        //     q.assert.ok(typeof node.range !== 'undefined', 'type: ' + node.type);
        // });

        var instrumentedCode = extractBodyOfAssertionAsCode(result);
        //tap.note(instrumentedCode);
        return instrumentedCode;
    };
}();


module.exports = {
    instrument: instrument,
    QUnit: q
};
