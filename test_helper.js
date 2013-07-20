var empower = require('./lib/empower'),
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
        options = options || {destructive: false, source: line, path: '/path/to/some_test.js'};
        var tree = extractBodyFrom(line);
        var result = empower(tree, options);
        var instrumentedCode = extractBodyOfAssertionAsCode(result);
        //tap.note(instrumentedCode);
        return instrumentedCode;
    };
}();


module.exports = {
    instrument: instrument,
    QUnit: q
};
