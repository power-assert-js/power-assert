var esprima = require('esprima'),
    escodegen = require('escodegen');

var powerAssert = function powerAssert(source) {
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


    var toLocObjectExpression = function (loc) {
        var start_line = loc.start.line,
            start_column = loc.start.column,
            end_line = loc.end.line,
            end_column = loc.end.column;
        return {
            "type": "ObjectExpression",
            "properties": [
                {
                    "type": "Property",
                    "key": {
                        "type": "Literal",
                        "value": "start"
                    },
                    "value": {
                        "type": "ObjectExpression",
                        "properties": [
                            {
                                "type": "Property",
                                "key": {
                                    "type": "Literal",
                                    "value": "line"
                                },
                                "value": {
                                    "type": "Literal",
                                    "value": start_line
                                },
                                "kind": "init"
                            },
                            {
                                "type": "Property",
                                "key": {
                                    "type": "Literal",
                                    "value": "column"
                                },
                                "value": {
                                    "type": "Literal",
                                    "value": start_column
                                },
                                "kind": "init"
                            }
                        ]
                    },
                    "kind": "init"
                },
                {
                    "type": "Property",
                    "key": {
                        "type": "Literal",
                        "value": "end"
                    },
                    "value": {
                        "type": "ObjectExpression",
                        "properties": [
                            {
                                "type": "Property",
                                "key": {
                                    "type": "Literal",
                                    "value": "line"
                                },
                                "value": {
                                    "type": "Literal",
                                    "value": end_line
                                },
                                "kind": "init"
                            },
                            {
                                "type": "Property",
                                "key": {
                                    "type": "Literal",
                                    "value": "column"
                                },
                                "value": {
                                    "type": "Literal",
                                    "value": end_column
                                },
                                "kind": "init"
                            }
                        ]
                    },
                    "kind": "init"
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
                        "type": "Identifier",
                        "name": "__save__"
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
                        //toLocObjectExpression(left.loc)
                    ]
                };
            }
            if (right.type === 'Identifier') {
                name = right.name;
                arg.right = {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": "__save__"
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
                        //toLocObjectExpression(right.loc)
                    ]
                };
            }

            var line = lines[node.loc.start.line - 1];
            node.expression = {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "__assert__"
                },
                "arguments": [
                    expression,
                    {
                        "type": "Literal",
                        "value": line
                    }
                ]
            };
        }
    });
    console.log(escodegen.generate(syntax));
    //return syntax;
};

/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = powerAssert;
}
