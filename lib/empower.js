/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
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
 */
(function (root, factory) {
    'use strict';

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.empower = factory();
    }
}(this, function () {
    'use strict';


var powerAssertVariableName = "_pa_";


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


function capture (kind, target, location) {
    return {
        type: "CallExpression",
        callee: {
            type: "MemberExpression",
            computed: false,
            object: {
                type: "Identifier",
                name: powerAssertVariableName
            },
            property: {
                type: "Identifier",
                name: kind
            }
        },
        arguments: [
            target,
            location
        ]
    };
};

// enclose in _pa_.ident
function captureIdent (target, location) {
    return capture('ident', target, location);
};

// enclose in _pa_.funcall
function captureFuncall (target, location) {
    return capture('funcall', target, location);
};

// enclose in _pa_.binary
function captureBinary (target, location) {
    return capture('binary', target, location);
};

function locationOf (node) {
    return {
        type: "ObjectExpression",
        properties: [
            {
                type: "Property",
                key: {
                    type: "Identifier",
                    name: "start"
                },
                value: {
                    type: "ObjectExpression",
                    properties: [
                        {
                            type: "Property",
                            key: {
                                type: "Identifier",
                                name: "line"
                            },
                            value: {
                                type: "Literal",
                                value: node.loc.start.line
                            },
                            kind: "init"
                        },
                        {
                            type: "Property",
                            key: {
                                type: "Identifier",
                                name: "column"
                            },
                            value: {
                                type: "Literal",
                                value: node.loc.start.column
                            },
                            kind: "init"
                        }
                    ]
                },
                kind: "init"
            }
        ]
    };
};



function Instrumentor(line) {
    this.line = line;
}
Instrumentor.prototype.propertyLocationOf = function (memberExpression) {
    var that = this,
        prop = memberExpression.property;
    if (typeof prop.loc !== 'undefined') {
        return locationOf(prop);
    } else if (typeof memberExpression.loc !== 'undefined') {
        var found = that.line.indexOf(prop.name, memberExpression.loc.start.column);
        if (found === -1) {
            throw new Error('Cannot detect property location: ' + prop.name + ' line: ' + that.line + ' col: ' + memberExpression.loc.start.column);
        }
        return locationOf({
            loc: {
                start: {
                    line: memberExpression.loc.start.line,
                    column: found
                }
            }
        });
    } else {
        throw new Error('Cannot detect property location: ' + prop.name + ' line: ' + that.line);
    }
};
Instrumentor.prototype.operatorLocationOf = function (binaryExpression) {
    var that = this,
        endOfLeftColumn = binaryExpression.left.loc.start.column + (binaryExpression.left.range[1] - binaryExpression.left.range[0]),
        operatorStartColumn = endOfLeftColumn + 1;
    if (that.line) {
        var found = that.line.indexOf(binaryExpression.operator, endOfLeftColumn);
        if (found !== -1) {
            operatorStartColumn = found;
        }
    }
    return locationOf({
        loc: {
            start: {
                line: binaryExpression.left.loc.start.line,
                column: operatorStartColumn
            }
        }
    });
};
Instrumentor.prototype.captureRecursively = function captureRecursively(node) {
    var that = this;
    switch (node.type) {
    case 'Identifier':
        return captureIdent(node, locationOf(node));
    case 'MemberExpression': // ex: foo.bar.baz
        node.object = that.captureRecursively(node.object);
        return captureIdent(node, that.propertyLocationOf(node));
    case 'CallExpression':
        node.arguments = node.arguments.map(function (arg) {
            return that.captureRecursively(arg);
        });
        if (node.callee.type === 'MemberExpression') {
            node.callee.object = that.captureRecursively(node.callee.object);
            return captureFuncall(node, that.propertyLocationOf(node.callee));
        } else {
            return captureFuncall(node, locationOf(node));
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
        return captureBinary(node, operatorLocation);
    case 'LogicalExpression':
        node.left = that.captureRecursively(node.left);
        node.right = that.captureRecursively(node.right);
        return node;
    default:
        return node;
    }
};


// enclose assert expression in _pa_.expr
function captureAssertion (node, location, content) {
    var exprArgs = [node, location];
    if (content) {
        exprArgs.push({
            type: "Literal",
            value: content
        });
    }
    return {
        type: "CallExpression",
        callee: {
            type: "MemberExpression",
            computed: false,
            object: {
                type: "Identifier",
                name: powerAssertVariableName
            },
            property: {
                type: "Identifier",
                name: "expr"
            }
        },
        arguments: exprArgs
    };
};


function retrieveLineFor (expression, options) {
    if (options['source']) {
        var source = options['source'];
        var lineNumber = expression.loc.start.line;
        var lines = source.split("\n");
        var line = lines[lineNumber - 1];
        return line;
    }
    // if (typeof expression.raw !== 'undefined') {
    //     return expression.raw;
    // }
};


function instrumentExpression (expression, options) {
    var firstArgument = expression.arguments[0],
        loc = locationOf(firstArgument),
        line;
    if (!isSupportedNodeType(firstArgument)) {
        return;
    }
    line = retrieveLineFor(expression, options);
    var instrumentor = new Instrumentor(line);
    firstArgument = instrumentor.captureRecursively(firstArgument);
    if (line) {
        expression.arguments[0] = captureAssertion(firstArgument, loc, line);
    } else {
        expression.arguments[0] = captureAssertion(firstArgument, loc);
    }
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

function isConsoleAssertOkCall (callee) {
    return detectTargetMemberExpression(callee, 'console', 'assert');
}

function isAssertCall (callee) {
    return (callee.type === 'Identifier' && callee.name === 'assert');
}

function isInstrumentationTarget (callee) {
    return isAssertCall(callee) || isAssertOkCall(callee) || isConsoleAssertOkCall(callee);
}


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


/**
 * JS AST in, JS AST out.
 * @param JavaScript AST to instrument (directly modified if destructive option is truthy)
 * @param options
 * @return instrumented AST
 */
function instrument (ast, options) {
    options = options || {};
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

// using returnExports UMD pattern
var exports = instrument;
exports.deepCopy = deepCopy;
return exports;
}));
