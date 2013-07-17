/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 *
 * A part of deepCopy function is:
 *   Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
 *   Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
 *   Released under the BSD license.
 *   http://github.com/Constellation/esmangle/raw/master/LICENSE.BSD
 */
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.empower = {}));
    }
}(this, function (exports) {
    'use strict';

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


var isSupportedNodeType = function () {
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


var retrieveLineFor = function (expression, options) {
    if ((options['strategy'] === 'inline') && options['source']) {
        var source = options['source'];
        var lineNumber = expression.loc.start.line;
        var lines = source.split("\n");
        var line = lines[lineNumber - 1];
        return line;
    }
};


var instrumentExpression = function (expression, options) {
    var firstArgument = expression.arguments[0],
        loc = locationOf(firstArgument),
        line;
    if (!isSupportedNodeType(firstArgument)) {
        return;
    }
    firstArgument = captureRecursively(firstArgument);
    line = retrieveLineFor(expression, options);
    if (line) {
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

var isInstrumentationTarget = function (callee) {
    return isAssertCall(callee) || isAssertOkCall(callee) || isConsoleAssertOkCall(callee);
};



// borrowed from esmangle
var deepCopy = function () {
    var isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }
    var deepCopyInternal = function (obj, result) {
        var key, val;
        for (key in obj) {
            if (key.lastIndexOf('__', 0) === 0) {
                continue;
            }
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    if (val instanceof RegExp) {
                        val = new RegExp(val);
                    } else {
                        val = deepCopyInternal(val, isArray(val) ? [] : {});
                    }
                }
                result[key] = val;
            }
        }
        return result;
    };
    return function (obj) {
        return deepCopyInternal(obj, isArray(obj) ? [] : {});
    };
}();


/**
 * JS AST in, JS AST out.
 * @param tree
 * @param options
 */
var instrumentTree = function (tree, options) {
    var result = (options['destructive']) ? tree : deepCopy(tree);
    traverse(result, function (node) {
        var expression;
        if (typeof node.type === 'undefined') {
            return;
        }
        if (node.type === 'ExpressionStatement') {
            expression = node.expression;
        } else if (node.type === 'ReturnStatement') {
            expression = node.argument;
        } else {
            return;
        }
        if (expression.type !== 'CallExpression') {
            return;
        }
        if (!(isInstrumentationTarget(expression.callee))) {
            return;
        }
        instrumentExpression(expression, options);
    });
    return result;
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


var insertPowerAssertDeclaration = function (tree, options) {
    //tree.body.unshift(formatterInstrumentation("../lib/formatter"));
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
    var result = instrumentTree(tree, options);
    if (options['module'] === 'commonjs') {
        insertPowerAssertDeclaration(result, options);
    }
    return result;
};


exports.instrumentExpression = instrumentExpression;
exports.instrumentTree = instrumentTree;
exports.instrument = instrument;
exports.deepCopy = deepCopy;
}));
