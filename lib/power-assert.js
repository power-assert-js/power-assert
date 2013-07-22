/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
(function (root, factory) {
    'use strict';

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(['assert', './power-assert-formatter-compact'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('assert'), require('./power-assert-formatter-compact'));
    } else {
        root.assert = factory(root.assert, root.PowerAssertCompactFormatter);
    }
}(this, function (baseAssert, Formatter) {
    'use strict';

    var powerAssert,
        events = [];

    function PowerAssertContext (arg) {
        this.result = arg.result;
        this.location = arg.location;
        this.content = arg.content;
        this.events = arg.events;
    }

    function ident (value, location) {
        events.push({value: value, location: location});
        return value;
    }
    function funcall (value, location) {
        events.push({value: value, location: location});
        return value;
    }
    function binary (value, location) {
        events.push({value: value, location: location});
        return value;
    }
    function expr (result, location, content) {
        var captured = events;
        events = [];
        return new PowerAssertContext({result: result, location: location, content: content, events: captured});
    }

    function rightToLeft (a, b) {
        return b.location.start.column - a.location.start.column;
    }

    function dump (obj) {
        return JSON.stringify(obj);
    }

    var powerOk = function (context, message) {
        if (context instanceof PowerAssertContext) {
            var result = context.result;
            if (!result) {
                context.events.sort(rightToLeft);
                var lines = [];
                var formatter = new Formatter(dump, function (str) { lines.push(str); });
                formatter.format(context.content, context.location, context.events);
                var powerAssertText = lines.join('\n');
                throw new baseAssert.AssertionError({
                    message: message ? message + ' ' + powerAssertText : powerAssertText,
                    stackStartFunction: powerOk
                });
            }
        } else {
            baseAssert.ok(context);
        }
    };

    powerAssert = powerOk;
    powerAssert.ok = powerOk;
    powerAssert.ident = ident;
    powerAssert.funcall = funcall;
    powerAssert.binary = binary;
    powerAssert.expr = expr;
    [
        'fail',
        // 'ok',
        'equal',
        'notEqual',
        'deepEqual',
        'notDeepEqual',
        'strictEqual',
        'notStrictEqual',
        'throws',
        'doesNotThrow',
        'ifError'
    ].forEach(function (name) {
        if (typeof baseAssert[name] === 'function') {
            powerAssert[name] = baseAssert[name];
        }
    });
    return powerAssert;
}));
