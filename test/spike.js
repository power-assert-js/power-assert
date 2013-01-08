var esprima = require('esprima'),
    q = require('qunitjs'),
    passert = require('../lib/power-assert'),
    util = require('util'),
    fs = require('fs'),
    path = require('path');

(function (qunitObject) {
    var qunitTap = require("qunit-tap").qunitTap;
    qunitTap(qunitObject, util.puts, {noPlan: true, showSourceOnFailure: true});
    qunitObject.init();
    qunitObject.config.updateRate = 0;
})(q);

q.test('spike', function (assert) {
    var hoge = 'foo';
    var fuga = 'bar';
    assert.ok(hoge === fuga);
    //assert.ok(look(hoge) === look(fuga));
    //passert('/Users/takuto/work/git-sandbox/private/power-assert.js/test/spike.js:19:12');

    function look(ident) {
        return ident;
    }

    // Executes visitor on the object and its children (recursively).
    function traverse(object, visitor) {
        var key, child;

        visitor.call(null, object);
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    traverse(child, visitor);
                }
            }
        }
    }

    var lineNumber = 18;

    var content, syntax, tokens;
    content = fs.readFileSync('/Users/takuto/work/git-sandbox/private/power-assert.js/test/spike.js', 'utf-8');
    // tokens = esprima.parse(content, { tokens: true, tolerant: true, loc: true, range: true }).tokens;
    // var filtered = tokens.filter(function (token) { return token.loc.start.line === 18; });
    // console.log(filtered.map(function (token) { return token.value; }).join(''));
    // console.log(JSON.stringify(filtered, null, 2));
    // var filtered = tokens.filter(function (token) { return token.loc.start.line === 18; });

    syntax = esprima.parse(content, {tolerant: true, loc: true});
    //console.log(JSON.stringify(syntax, null, 2));
    traverse(syntax, function (node) {
        //console.log(node.type);
        if (typeof node.loc !== 'undefined' && node.loc.start.line === lineNumber) {
            if (typeof node.type !== 'undefined' && node.type === 'ExpressionStatement') {
                var expression = node.expression,
                    callee = expression.callee;
                if (callee.type === 'MemberExpression' && callee.computed === false) {
                    var ob = callee.object,
                        prop = callee.property;
                    if ((ob.type === 'Identifier' && ob.name === 'assert') && (prop.type === 'Identifier' && prop.name === 'ok')) {
                        var arg = expression.arguments[0];
                        console.log(JSON.stringify(arg, null, 4));
                        // if (args.type === 'BinaryExpression') {
                        //     console.log(JSON.stringify(args, null, 4));
                        // }
                    }
                }
            }
        };
    });
});
