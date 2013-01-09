/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 * version: 0.0.1pre
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 *
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
        'LogicalExpression'
    ];
//// TODO
// 'ArrayExpression',
// 'AssignmentExpression',
// 'CallExpression',
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

    return function (node) {
        return supported.some(function (kind) { return node.type === kind; });
    };
};


// enclose in _pa_.ident
var capture = function (target, ident) {
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
                "name": "ident"
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


var captureRecursively = function (node) {
    switch (node.type) {
    case 'Identifier':
        return capture(node, node);
    case 'MemberExpression': // ex: foo.bar.baz
        node.object = captureRecursively(node.object);
        return capture(node, node.property);
    case 'UnaryExpression':
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
var captureFirstArgument = function (firstArgument, line, lineNumber) {
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
            firstArgument,
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
    expression.arguments[0] = captureFirstArgument(firstArgument, line, lineNumber);
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


var modifyTree = function (syntax, lines) {
    traverse(syntax, function (node) {
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


var empower = function empower(source, options) {
    options = options || {};
    var lines = source.split("\n"),
        tree = esprima.parse(source, {tolerant: true, loc: true});
    modifyTree(tree, lines, options);

    if (options['module'] === 'CommonJS') {
        // insert "var _pa_ = require('power-assert');"
        tree.body.unshift(powerAssertVariableDeclaration);
    }

    console.log(escodegen.generate(tree));
};


empower.modifyTree = modifyTree;
empower.instrument = instrument;


/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = empower;
}
