/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
var esprima = require('esprima'),
    escodegen = require('escodegen'),
    powerAssertVariableName = "_pa_",
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


var capture = function (kind, target, column) {
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
            {
                "type": "Literal",
                "value": column.start
            },
            {
                "type": "Literal",
                "value": column.end
            }
        ]
    };
};

// enclose in _pa_.ident
var captureIdent = function (target, column) {
    return capture('ident', target, column);
};

// enclose in _pa_.funcall
var captureFuncall = function (target, column) {
    return capture('funcall', target, column);
};

// enclose in _pa_.binary
var captureBinary = function (target, column) {
    return capture('binary', target, column);
};

var locationOf = function (node) {
    return {
        start: node.loc.start.column,
        end: node.loc.end.column
    };
};

var captureRecursively = function (node, line) {
    switch (node.type) {
    case 'Identifier':
        return captureIdent(node, locationOf(node));
    case 'MemberExpression': // ex: foo.bar.baz
        node.object = captureRecursively(node.object, line);
        return captureIdent(node, locationOf(node.property));
    case 'CallExpression':
        node.arguments = node.arguments.map(function (arg) {
            return captureRecursively(arg, line);
        });
        if (node.callee.type === 'MemberExpression') {
            node.callee.object = captureRecursively(node.callee.object, line);
            return captureFuncall(node, locationOf(node.callee.property));
        } else {
            return captureFuncall(node, locationOf(node));
        }
    case 'UnaryExpression':
        if (node.operator === 'typeof') {
            // 'typeof' operator is not supported
            return node;
        }
        node.argument = captureRecursively(node.argument, line);
        return node;
    case 'BinaryExpression':
        var operatorStart = line.indexOf(node.operator, node.left.loc.end.column);
        var operatorLocation = {
            start: operatorStart,
            end: operatorStart + node.operator.length
        };
        node.left = captureRecursively(node.left, line);
        node.right = captureRecursively(node.right, line);
        return captureBinary(node, operatorLocation);
    case 'LogicalExpression':
        node.left = captureRecursively(node.left, line);
        node.right = captureRecursively(node.right, line);
        return node;
    default:
        return node;
    }
};


// enclose assert expression in _pa_.expr
var captureAssertion = function (node, line, lineNumber) {
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
        "arguments": [
            node,
            {
                "type": "Literal",
                "value": line
            },
            {
                "type": "Literal",
                "value": lineNumber
            }
        ]
    };
};


var instrumentExpression = function (expression, line, lineNumber) {
    var firstArgument = expression.arguments[0];
    if (!isSupported(firstArgument)) {
        return;
    }
    firstArgument = captureRecursively(firstArgument, line);
    expression.arguments[0] = captureAssertion(firstArgument, line, lineNumber);
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


var instrumentTree = function (tree, lines) {
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
        var lineNumber = node.loc.start.line;
        var line = lines[lineNumber - 1];
        instrumentExpression(expression, line, lineNumber);
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
    tree.body.unshift(defaultFormatterInstrumentationExpression);
    tree.body.unshift(powerAssertVariableDeclaration);
};


var empower = function empower(source, options) {
    options = options || {};
    var lines = source.split("\n"),
        tree = esprima.parse(source, {tolerant: true, loc: true});
    instrumentTree(tree, lines);
    if (options['module'] === 'commonjs') {
        insertPowerAssertDeclaration(tree, options);
    }
    return escodegen.generate(tree);
};


empower.instrumentExpression = instrumentExpression;
empower.instrumentTree = instrumentTree;


/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = empower;
}
