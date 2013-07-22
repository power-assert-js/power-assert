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
        define(['./power-assert-formatter-compact'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('./power-assert-formatter-compact'));
    } else {
        root.empowerQUnit = factory(root.PowerAssertCompactFormatter);
    }
}(this, function (Formatter) {
    'use strict';

    var events = [];

    // borrowed from qunit.js
    var extend = function (a, b) {
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

    function PowerAssertContext (arg) {
        this.result = arg.result;
        this.location = arg.location;
        this.content = arg.content;
        this.events = arg.events;
    }

    function rightToLeft (a, b) {
        return b.location.start.column - a.location.start.column;
    }

    function dump (obj) {
        return JSON.stringify(obj);
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

    return function (qunit) {
        var origQUnitAssert = extend({}, qunit.assert);

        function powerOk (context, message) {
            if (context instanceof PowerAssertContext) {
                var result = context.result;
                if (!result) {
                    context.events.sort(rightToLeft);
                    var lines = [];
                    var formatter = new Formatter(dump, function (str) { lines.push(str); });
                    formatter.format(context.content, context.location, context.events);
                    var powerAssertText = lines.join('\n');
                    origQUnitAssert.ok(result, message ? message + ' ' + powerAssertText : powerAssertText);
                }
            } else {
                origQUnitAssert.ok(context);
            }
        };

        extend(qunit.assert, {
            ok: powerOk,
            ident: ident,
            funcall: funcall,
            binary: binary,
            expr: expr
        });

        return qunit;
    };
}));
