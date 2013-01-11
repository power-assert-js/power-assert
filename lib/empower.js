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

var locationOf = function (node) {
    return {
        start: node.loc.start.column,
        end: node.loc.end.column
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
        return captureFuncall(node, locationOf(node));
    case 'UnaryExpression':
        if (node.operator === 'typeof') {
            // 'typeof' operator is not supported
            return node;
        }
        node.argument = captureRecursively(node.argument);
        return node;
    case 'BinaryExpression':
        node.left = captureRecursively(node.left);
        node.right = captureRecursively(node.right);
        return node;
    case 'LogicalExpression':
        node.left = captureRecursively(node.left);
        node.right = captureRecursively(node.right);
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


var instrument = function (expression, line, lineNumber) {
    var firstArgument = expression.arguments[0];
    if (!isSupported(firstArgument)) {
        return;
    }
    firstArgument = captureRecursively(firstArgument);
    expression.arguments[0] = captureAssertion(firstArgument, line, lineNumber);
};


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


var instrumentWholeTree = function (tree, lines) {
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
        if (!(isAssertCall(callee) || isAssertOkCall(callee))) {
            return;
        }
        var lineNumber = node.loc.start.line;
        var line = lines[lineNumber - 1];
        instrument(expression, line, lineNumber);
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


var insertPowerAssertDeclarationIfCommonJs = function (options, tree) {
    if (options['module'] === 'commonjs') {
        // insert "var _pa_ = require('power-assert');"
        tree.body.unshift(powerAssertVariableDeclaration);
    }
};


var empower = function empower(source, options) {
    options = options || {};
    var lines = source.split("\n"),
        tree = esprima.parse(source, {tolerant: true, loc: true});
    instrumentWholeTree(tree, lines, options);
    insertPowerAssertDeclarationIfCommonJs(options, tree);
    console.log(escodegen.generate(tree));
};


empower.instrument = instrument;
empower.instrumentWholeTree = instrumentWholeTree;


/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = empower;
}
