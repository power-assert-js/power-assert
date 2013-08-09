/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 *
 * A part of traverse function is:
 *   Copyright (C) 2012, 2011 Ariya Hidayat <ariya.hidayat@gmail.com> and other contributors.
 *   Released under the BSD license.
 *   https://github.com/ariya/esprima/raw/master/LICENSE.BSD
 *
 * A part of deepCopy function is:
 *   Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com> and other contributors.
 *   Released under the BSD license.
 *   https://github.com/Constellation/esmangle/raw/master/LICENSE.BSD
 *
 * A part of extend function is:
 *   Copyright 2012 jQuery Foundation and other contributors
 *   Released under the MIT license.
 *   http://jquery.org/license
 *
 */
(function (root, factory) {
    'use strict';

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.espower = factory();
    }
}(this, function () {
    'use strict';


var DEFAULT_OPTIONS = {
    destructive: false,
    powerAssertVariableName: "assert"
};


/**
 * JS AST in, JS AST out.
 * @param JavaScript AST to instrument (directly modified if destructive option is truthy)
 * @param options
 * @return instrumented AST
 */
function espower (ast, options) {
    options = extend(deepCopy(DEFAULT_OPTIONS), (options || {}));
    if (typeof ast.loc === 'undefined') {
        var errorMessage = 'JavaScript AST should contain location information.'; 
        if (options['path']) {
            errorMessage += ' path: ' + options['path'];
        }
        throw new Error(errorMessage);
    }
    var result = (options['destructive']) ? ast : deepCopy(ast);
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
}


function instrumentExpression (callExpression, options) {
    var targetNode = callExpression.arguments[0],
        instrumentor;
    if (!isSupportedNodeType(targetNode)) {
        return;
    }
    instrumentor = createInstrumentor(callExpression, options);
    callExpression.arguments[0] = instrumentor.instrument(targetNode);
}


function createInstrumentor(callExpression, options) {
    var line = retrieveLineFor(callExpression, options);
    return new Instrumentor(line, options);
}


function retrieveLineFor (callExpression, options) {
    if (options['source']) {
        var source = options['source'];
        var lineNumber = callExpression.loc.start.line;
        var lines = source.split("\n");
        var line = lines[lineNumber - 1];
        return line;
    }
    return null;
    // if (typeof callExpression.raw !== 'undefined') {
    //     return callExpression.raw;
    // }
}


function Instrumentor (line, options) {
    this.line = line;
    this.path = options['path'];
    this.powerAssertVariableName = options['powerAssertVariableName'];
}

Instrumentor.prototype.instrument = function (node) {
    var that = this,
        loc = that.locationOf(node),
        modifiedTree = that.captureRecursively(node);
    return that.captureAssertion(modifiedTree, loc);
};

Instrumentor.prototype.captureRecursively = function (node) {
    var that = this;
    switch (node.type) {
    case 'Identifier':
        return that.captureIdent(node, that.locationOf(node));
    case 'MemberExpression': // ex: foo.bar.baz
        node.object = that.captureRecursively(node.object);
        return that.captureIdent(node, that.propertyLocationOf(node));
    case 'CallExpression':
        node.arguments = node.arguments.map(function (arg) {
            return that.captureRecursively(arg);
        });
        if (node.callee.type === 'MemberExpression') {
            node.callee.object = that.captureRecursively(node.callee.object);
            return that.captureFuncall(node, that.propertyLocationOf(node.callee));
        } else {
            return that.captureFuncall(node, that.locationOf(node));
        }
    case 'UnaryExpression':
        if (node.operator === 'typeof') {
            return node; // 'typeof' operator is not supported
        }
        node.argument = that.captureRecursively(node.argument);
        return node;
    case 'BinaryExpression':
        var operatorLocation = that.operatorLocationOf(node); // BK: need to detect operator location before left/right instrumentation
        node.left = that.captureRecursively(node.left);
        node.right = that.captureRecursively(node.right);
        return that.captureBinary(node, operatorLocation);
    case 'LogicalExpression':
        node.left = that.captureRecursively(node.left);
        node.right = that.captureRecursively(node.right);
        return node;
    default:
        return node;
    }
};

Instrumentor.prototype.propertyLocationOf = function (memberExpression) {
    var that = this,
        n = newNodeWithLocationCopyOf(memberExpression),
        newLocation,
        prop = memberExpression.property,
        propertyIndex;
    if (typeof prop.loc !== 'undefined') { // esprima
        return that.locationOf(prop);
    } else if (typeof memberExpression.loc !== 'undefined') { // CoffeeScriptRedux
        propertyIndex = that.line.indexOf(prop.name, memberExpression.loc.start.column);
        if (propertyIndex === -1) {
            throw new Error('Cannot detect property location: ' + prop.name + ' line: ' + that.line + ' col: ' + memberExpression.loc.start.column);
        }
        newLocation = n({});
        newLocation.loc.start = {
            line: memberExpression.loc.start.line,
            column: propertyIndex
        };
        return that.locationOf(newLocation);
    } else {
        throw new Error('Cannot detect property location: ' + prop.name + ' line: ' + that.line);
    }
};

Instrumentor.prototype.operatorLocationOf = function (binaryExpression) {
    var that = this,
        n = newNodeWithLocationCopyOf(binaryExpression),
        newLocation,
        endOfLeftColumn,
        operatorStartColumn,
        operatorIndex;

    if (binaryExpression.left.loc.end && binaryExpression.left.loc.end.column) { // esprima
        endOfLeftColumn = binaryExpression.left.loc.end.column;
    } else if (binaryExpression.left.range) { // CoffeeScriptRedux
        endOfLeftColumn = binaryExpression.left.loc.start.column + (binaryExpression.left.range[1] - binaryExpression.left.range[0]);
    } else {
        throw new Error('Cannot detect operator location: ' + binaryExpression.operator + ' line: ' + that.line);
    }
    operatorStartColumn = endOfLeftColumn + 1;

    if (that.line) {
        operatorIndex = that.line.indexOf(binaryExpression.operator, endOfLeftColumn);
        if (operatorIndex !== -1) {
            operatorStartColumn = operatorIndex;
        }
    }
    newLocation = n({});
    newLocation.loc.start = {
        line: binaryExpression.left.loc.start.line,
        column: operatorStartColumn
    };
    return that.locationOf(newLocation);
};

// enclose assert expression in _pa_.expr
Instrumentor.prototype.captureAssertion = function (node, location) {
    var n = newNodeWithLocationCopyOf(node);
    var exprArgs = [node, location];
    if (this.line) {
        exprArgs.push(n({
            type: "Literal",
            value: this.line
        }));
    }
    if (this.path) {
        location.properties.push(n({
            type: "Property",
            key: n({
                type: "Identifier",
                name: "path"
            }),
            value: n({
                type: "Literal",
                value: this.path
            }),
            kind: "init"
        }));
    }
    return n({
        type: "CallExpression",
        callee: n({
            type: "MemberExpression",
            computed: false,
            object: n({
                type: "Identifier",
                name: this.powerAssertVariableName
            }),
            property: n({
                type: "Identifier",
                name: "expr"
            })
        }),
        arguments: exprArgs
    });
};

// enclose in _pa_.ident
Instrumentor.prototype.captureIdent = function (target, location) {
    return this.captureNode('ident', target, location);
};

// enclose in _pa_.funcall
Instrumentor.prototype.captureFuncall = function (target, location) {
    return this.captureNode('funcall', target, location);
};

// enclose in _pa_.binary
Instrumentor.prototype.captureBinary = function (target, location) {
    return this.captureNode('binary', target, location);
};

Instrumentor.prototype.captureNode = function (kind, target, location) {
    var n = newNodeWithLocationCopyOf(target);
    return n({
        type: "CallExpression",
        callee: n({
            type: "MemberExpression",
            computed: false,
            object: n({
                type: "Identifier",
                name: this.powerAssertVariableName
            }),
            property: n({
                type: "Identifier",
                name: "capture"
            })
        }),
        arguments: [
            target,
            n({
                type: "Literal",
                value: kind
            }),
            location
        ]
    });
};

Instrumentor.prototype.locationOf = function (node) {
    var n = newNodeWithLocationCopyOf(node);
    return n({
        type: "ObjectExpression",
        properties: [
            n({
                type: "Property",
                key: n({
                    type: "Identifier",
                    name: "start"
                }),
                value: n({
                    type: "ObjectExpression",
                    properties: [
                        n({
                            type: "Property",
                            key: n({
                                type: "Identifier",
                                name: "line"
                            }),
                            value: n({
                                type: "Literal",
                                value: node.loc.start.line
                            }),
                            kind: "init"
                        }),
                        n({
                            type: "Property",
                            key: n({
                                type: "Identifier",
                                name: "column"
                            }),
                            value: n({
                                type: "Literal",
                                value: node.loc.start.column
                            }),
                            kind: "init"
                        })
                    ]
                }),
                kind: "init"
            })
        ]
    });
};


function newNodeWithLocationCopyOf (original) {
    return function (newNode) {
        if (typeof original.loc !== 'undefined') {
            newNode.loc = deepCopy(original.loc);
        }
        if (typeof original.range !== 'undefined') {
            newNode.range = deepCopy(original.range);
        }
        return newNode;
    };
}

function detectTargetMemberExpression (callee, objName, propName) {
    if (callee.type !== 'MemberExpression' || callee.computed !== false) {
        return false;
    }
    var obj = callee.object,
        prop = callee.property;
    return ((obj.type === 'Identifier' && obj.name === objName) && (prop.type === 'Identifier' && prop.name === propName));
}

function isAssertOkCall (callee) {
    return detectTargetMemberExpression(callee, 'assert', 'ok');
}

function isAssertCall (callee) {
    return (callee.type === 'Identifier' && callee.name === 'assert');
}

function isInstrumentationTarget (callee) {
    return isAssertCall(callee) || isAssertOkCall(callee);
}

var isSupportedNodeType = (function () {
    var supported = [
        'Identifier',
        'UnaryExpression',
        'BinaryExpression',
        'MemberExpression',
        'CallExpression',
        'LogicalExpression'
    ];
//// expressions
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

    return function (node) {
        return supported.some(function (kind) { return node.type === kind; });
    };
})();


// borrowed from esprima example
// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {
    var key, child;

    if (visitor.call(null, object) === false) {
        return;
    }
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}


// borrowed from esmangle
var deepCopy = (function () {
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
})();


// borrowed from qunit.js
function extend (a, b) {
    var prop;
    for (prop in b) {
        if (b.hasOwnProperty(prop)) {
            if (typeof b[prop] === 'undefined') {
                delete a[prop];
            } else {
                a[prop] = b[prop];
            }
        }
    }
    return a;
};


// using returnExports UMD pattern with substack pattern
var exports = espower;
exports.deepCopy = deepCopy;
exports.traverse = traverse;
return exports;
}));
