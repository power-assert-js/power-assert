var esprima = require('esprima'),
    escodegen = require('escodegen');

var powerAssertVariableDeclaration = {
    "type": "VariableDeclaration",
    "declarations": [
        {
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "passert"
            },
            "init": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "require"
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "value": "../lib/power-assert"
                    }
                ]
            }
        }
    ],
    "kind": "var"
};

// Executes visitor on the object and its children (recursively).
var traverse = function traverse(object, visitor) {
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
};

var powerAssertGenerator = function powerAssertGenerator(source, options) {
    options = options || {};
    var lines = source.split("\n");
    var syntax = esprima.parse(source, {tolerant: true, loc: true});

    var isAssertOkCall = function (callee) {
        if (callee.type !== 'MemberExpression' || callee.computed !== false) {
            return false;
        }
        var ob = callee.object,
            prop = callee.property;
        return ((ob.type === 'Identifier' && ob.name === 'assert') && (prop.type === 'Identifier' && prop.name === 'ok'));
    };

    var isAssertCall = function (callee) {
        return (callee.type === 'Identifier' && callee.name === 'assert');
    };

    // enclose  in __ident__
    var capture = function (target, ident) {
        return {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                    "type": "Identifier",
                    "name": "passert"
                },
                "property": {
                    "type": "Identifier",
                    "name": "__ident__"
                }
            },
            "arguments": [
                {
                    "type": "Literal",
                    "value": ident.name
                },
                target,
                {
                    "type": "Literal",
                    "value": ident.loc.start.column
                },
                {
                    "type": "Literal",
                    "value": ident.loc.end.column
                }
            ]
        };
    };

    var captureIdent = function (ident) {
        return capture(ident, ident);
    };

    var captureMember = function (member) {
        member.object = captureIdent(member.object);
        return capture(member, member.property);
    };

    // enclose assert expression in __expr__
    var captureFirstArgument = function (firstArgument, line) {
        return {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                    "type": "Identifier",
                    "name": "passert"
                },
                "property": {
                    "type": "Identifier",
                    "name": "__expr__"
                }
            },
            "arguments": [
                firstArgument,
                {
                    "type": "Literal",
                    "value": line
                }
            ]
        };
    };

    traverse(syntax, function (node) {
        if (typeof node.type === 'undefined' || node.type !== 'ExpressionStatement') {
            return;
        }
        var expression = node.expression;
        if (typeof expression.type === 'undefined' || expression.type !== 'CallExpression') {
            return;
        }
        var callee = expression.callee;
        if (!(isAssertCall(callee) || isAssertOkCall(callee))) {
            return;
        }

        var line = lines[node.loc.start.line - 1];

        var firstArgument = expression.arguments[0];

        if (firstArgument.type === 'Identifier') {
            firstArgument = captureIdent(firstArgument);
            expression.arguments[0] = captureFirstArgument(firstArgument, line);
        } else if (firstArgument.type === 'BinaryExpression') {
            var left = firstArgument.left,
                right = firstArgument.right;

            if (left.type === 'Identifier') {
                firstArgument.left = captureIdent(left);
            } else if (left.type === 'MemberExpression') {
                // ex: ary.length
                firstArgument.left = captureMember(left);
            }

            if (right.type === 'Identifier') {
                firstArgument.right = captureIdent(right);
            } else if (right.type === 'MemberExpression') {
                // ex: ary.length
                firstArgument.right = captureMember(right);
            }

            expression.arguments[0] = captureFirstArgument(firstArgument, line);
        }
    });

    if (options['module'] === 'CommonJS') {
        // insert "var passert = require('power-assert');"
        syntax.body.unshift(powerAssertVariableDeclaration);
    }

    console.log(escodegen.generate(syntax));
    //return syntax;
};

/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = powerAssertGenerator;
}
