var esprima = require('esprima'),
    escodegen = require('escodegen');


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
                "name": "_pa_"
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
var captureFirstArgument = function (firstArgument, line) {
    return {
        "type": "CallExpression",
        "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
                "type": "Identifier",
                "name": "_pa_"
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
            }
        ]
    };
};


var instrument = function (expression, line) {
    var firstArgument = expression.arguments[0];
    if (!isSupported(firstArgument)) {
        return;
    }
    firstArgument = captureRecursively(firstArgument);
    expression.arguments[0] = captureFirstArgument(firstArgument, line);
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
        var line = lines[node.loc.start.line - 1];
        instrument(expression, line);
    });
};


var powerAssertVariableDeclaration = {
    "type": "VariableDeclaration",
    "declarations": [
        {
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "_pa_"
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


var generator = function generator(source, options) {
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


generator.modifyTree = modifyTree;
generator.instrument = instrument;


/*global exports:false*/
if (typeof exports !== 'undefined') {
    module.exports = generator;
}
