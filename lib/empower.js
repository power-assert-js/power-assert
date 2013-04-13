/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
var powerAssertVariableName = "_pa_",
    powerAssertModuleName = "power-assert";


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


var isSupported = function () {
    var supported = [
        'Identifier',
        'UnaryExpression',
        'BinaryExpression',
        'MemberExpression',
        'CallExpression',
        'LogicalExpression'
    ];
//// TODO
// 'ArrayExpression',
// 'AssignmentExpression',
// 'ConditionalExpression',
// 'FunctionExpression',
// 'NewExpression',
// 'ObjectExpression',
// 'RegularExpression',
// 'SequenceExpression',
// 'ThisExpression',
// 'UpdateExpression',

//// DONE
// 'BinaryExpression',
// 'MemberExpression',
// 'LogicalExpression',
// 'UnaryExpression',
// 'CallExpression',

    return function (node) {
        return supported.some(function (kind) { return node.type === kind; });
    };
};


var capture = function (kind, target, location) {
    return {
        "type": "CallExpression",
        "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
                "type": "Identifier",
                "name": powerAssertVariableName
            },
            "property": {
                "type": "Identifier",
                "name": kind
            }
        },
        "arguments": [
            target,
            location
        ]
    };
};

// enclose in _pa_.ident
var captureIdent = function (target, location) {
    return capture('ident', target, location);
};

// enclose in _pa_.funcall
var captureFuncall = function (target, location) {
    return capture('funcall', target, location);
};

// enclose in _pa_.binary
var captureBinary = function (target, location) {
    return capture('binary', target, location);
};

var locationOf = function (node) {
    return {
        "type": "ObjectExpression",
        "properties": [
            {
                "type": "Property",
                "key": {
                    "type": "Identifier",
                    "name": "start"
                },
                "value": {
                    "type": "ObjectExpression",
                    "properties": [
                        {
                            "type": "Property",
                            "key": {
                                "type": "Identifier",
                                "name": "line"
                            },
                            "value": {
                                "type": "Literal",
                                "value": node.loc.start.line
                            },
                            "kind": "init"
                        },
                        {
                            "type": "Property",
                            "key": {
                                "type": "Identifier",
                                "name": "column"
                            },
                            "value": {
                                "type": "Literal",
                                "value": node.loc.start.column
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
                    "type": "Identifier",
                    "name": "end"
                },
                "value": {
                    "type": "ObjectExpression",
                    "properties": [
                        {
                            "type": "Property",
                            "key": {
                                "type": "Identifier",
                                "name": "line"
                            },
                            "value": {
                                "type": "Literal",
                                "value": node.loc.end.line
                            },
                            "kind": "init"
                        },
                        {
                            "type": "Property",
                            "key": {
                                "type": "Identifier",
                                "name": "column"
                            },
                            "value": {
                                "type": "Literal",
                                "value": node.loc.end.column
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

var captureRecursively = function (node) {
    switch (node.type) {
    case 'Identifier':
        return captureIdent(node, locationOf(node));
    case 'MemberExpression': // ex: foo.bar.baz
        node.object = captureRecursively(node.object);
        return captureIdent(node, locationOf(node.property));
    case 'CallExpression':
        node.arguments = node.arguments.map(function (arg) {
            return captureRecursively(arg);
        });
        if (node.callee.type === 'MemberExpression') {
            node.callee.object = captureRecursively(node.callee.object);
            return captureFuncall(node, locationOf(node.callee.property));
        } else {
            return captureFuncall(node, locationOf(node));
        }
    case 'UnaryExpression':
        if (node.operator === 'typeof') {
            // 'typeof' operator is not supported
            return node;
        }
        node.argument = captureRecursively(node.argument);
        return node;
    case 'BinaryExpression':
        // var operatorStart = line.indexOf(node.operator, node.left.loc.end.column);
        var locationHint = {
            loc: {
                start: {
                    line: node.left.loc.end.line,
                    column: node.left.loc.end.column + 1
                    //column: node.left.loc.end.column
                },
                end: {
                    line: node.right.loc.start.line,
                    column: node.right.loc.start.column - 1
                    //column: node.right.loc.start.column
                }
            }
        };
        node.left = captureRecursively(node.left);
        node.right = captureRecursively(node.right);
        return captureBinary(node, locationOf(locationHint));
        //return captureBinary(node, locationOf(node)); // TODO
    case 'LogicalExpression':
        node.left = captureRecursively(node.left);
        node.right = captureRecursively(node.right);
        return node;
    default:
        return node;
    }
};


// enclose assert expression in _pa_.expr
var captureAssertion = function (node, location, content) {
    var exprArgs = [node, location];
    if (content) {
        exprArgs.push({
            "type": "Literal",
            "value": content
        });
    }
    return {
        "type": "CallExpression",
        "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
                "type": "Identifier",
                "name": powerAssertVariableName
            },
            "property": {
                "type": "Identifier",
                "name": "expr"
            }
        },
        "arguments": exprArgs
    };
};


var instrumentExpression = function (expression, options) {
    var firstArgument = expression.arguments[0],
        loc = locationOf(firstArgument);
    if (!isSupported(firstArgument)) {
        return;
    }
    firstArgument = captureRecursively(firstArgument);
    if ((options['strategy'] === 'inline') && options['source']) {
        var source = options['source'];
        var lineNumber = expression.loc.start.line;
        var lines = source.split("\n");
        var line = lines[lineNumber - 1];
        expression.arguments[0] = captureAssertion(firstArgument, loc, line);
    } else {
        expression.arguments[0] = captureAssertion(firstArgument, loc);
    }
};


var detectTargetMemberExpression = function (callee, objName, propName) {
    if (callee.type !== 'MemberExpression' || callee.computed !== false) {
        return false;
    }
    var obj = callee.object,
        prop = callee.property;
    return ((obj.type === 'Identifier' && obj.name === objName) && (prop.type === 'Identifier' && prop.name === propName));
};

var isAssertOkCall = function (callee) {
    return detectTargetMemberExpression(callee, 'assert', 'ok');
};

var isConsoleAssertOkCall = function (callee) {
    return detectTargetMemberExpression(callee, 'console', 'assert');
};

var isAssertCall = function (callee) {
    return (callee.type === 'Identifier' && callee.name === 'assert');
};


/**
 * JS AST in, JS AST out.
 * @param tree
 * @param options
 */
var instrumentTree = function (tree, options) {
    traverse(tree, function (node) {
        if (typeof node.type === 'undefined') {
            return;
        }
        if (node.type !== 'ExpressionStatement') {
            return;
        }
        var expression = node.expression;
        if (expression.type !== 'CallExpression') {
            return;
        }
        var callee = expression.callee;
        if (!(isAssertCall(callee) || isAssertOkCall(callee) || isConsoleAssertOkCall(callee))) {
            return;
        }
        instrumentExpression(expression, options);
    });
};


var powerAssertVariableDeclaration = {
    "type": "VariableDeclaration",
    "declarations": [
        {
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": powerAssertVariableName
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
                        "value": powerAssertModuleName
                    }
                ]
            }
        }
    ],
    "kind": "var"
};


var defaultFormatterInstrumentationExpression = {
    "type": "ExpressionStatement",
    "expression": {
        "type": "CallExpression",
        "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
                "type": "Identifier",
                "name": powerAssertVariableName
            },
            "property": {
                "type": "Identifier",
                "name": "useDefault"
            }
        },
        "arguments": []
    }
};


var formatterInstrumentation = function (formatterRequirePath) {
    return {
        "type": "ExpressionStatement",
        "expression": {
            "type": "CallExpression",
            "callee": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "require"
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "value": formatterRequirePath
                    }
                ]
            },
            "arguments": [
                {
                    "type": "Identifier",
                    "name": powerAssertVariableName
                }
            ]
        }
    };
};


var insertPowerAssertDeclaration = function (tree, options) {
    //tree.body.unshift(formatterInstrumentation("../lib/formatter"));
//    tree.body.unshift(formatterInstrumentation(''));
    tree.body.unshift(defaultFormatterInstrumentationExpression);
    tree.body.unshift(powerAssertVariableDeclaration);
};


/**
 * JS AST in, JS AST out.
 * @param tree
 * @param options
 */
var instrument = function instrument(tree, options) {
    options = options || {};
    options['strategy'] = options['strategy'] || 'inline';
    instrumentTree(tree, options);
    if (options['module'] === 'commonjs') {
        insertPowerAssertDeclaration(tree, options);
    }
};


var empower = function empower(tree, options) {
    options = options || {};
    instrument(tree, options);
};


empower.instrumentExpression = instrumentExpression;
empower.instrumentTree = instrumentTree;
empower.instrument = instrument;


/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = empower;
}
