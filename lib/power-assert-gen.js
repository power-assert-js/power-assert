var esprima = require('esprima'),
    escodegen = require('escodegen');

var powerAssertGenerator = function powerAssertGenerator(source) {
    var lines = source.split("\n");
    var syntax = esprima.parse(source, {tolerant: true, loc: true});

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

    var isAssertOkCall = function (expression) {
        var ob = expression.object,
            prop = expression.property;
        return ((ob.type === 'Identifier' && ob.name === 'assert') && (prop.type === 'Identifier' && prop.name === 'ok'));
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
        if (callee.type !== 'MemberExpression' || callee.computed !== false) {
            return;
        }
        if (!isAssertOkCall(callee)) {
            return;
        }
        var arg = expression.arguments[0];
        //console.log(JSON.stringify(arg, null, 4));
        if (arg.type === 'BinaryExpression') {
            var name,
                left = arg.left,
                right = arg.right;
            if (left.type === 'Identifier') {
                name = left.name;
                arg.left = {
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
                            "value": name
                        },
                        left,
                        {
                            "type": "Literal",
                            "value": left.loc.start.column
                        },
                        {
                            "type": "Literal",
                            "value": left.loc.end.column
                        }
                    ]
                };
            }
            if (right.type === 'Identifier') {
                name = right.name;
                arg.right = {
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
                            "value": name
                        },
                        right,
                        {
                            "type": "Literal",
                            "value": right.loc.start.column
                        },
                        {
                            "type": "Literal",
                            "value": right.loc.end.column
                        }
                    ]
                };
            }

            var line = lines[node.loc.start.line - 1];

            // enclose assert expression in __expr__
            expression.arguments[0] = {
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
                    arg,
                    {
                        "type": "Literal",
                        "value": line
                    }
                ]
            };

            // // enclose assert.ok in __assert__
            // node.expression = {
            //     "type": "CallExpression",
            //     "callee": {
            //         "type": "MemberExpression",
            //         "computed": false,
            //         "object": {
            //             "type": "Identifier",
            //             "name": "passert"
            //         },
            //         "property": {
            //             "type": "Identifier",
            //             "name": "__assert__"
            //         }
            //     },
            //     "arguments": [
            //         expression,
            //         {
            //             "type": "Literal",
            //             "value": line
            //         }
            //     ]
            // };
        }
    });

    syntax.body.unshift(
        {
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
        }
    );

    console.log(escodegen.generate(syntax));
    //return syntax;
};

/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = powerAssertGenerator;
}
