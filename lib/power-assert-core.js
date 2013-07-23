/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 */
(function (root, factory) {
    'use strict';

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.empowerAssert = factory();
    }
}(this, function () {
    'use strict';

    var events = [];

    function PowerAssertContext (arg) {
        this.context = arg;
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

    return function (baseAssert, formatter, callback) {
        var powerOk = function (value, message) {
            if (value instanceof PowerAssertContext) {
                var context = value.context;
                if (!context.result) {
                    var lines = formatter.format(context);
                    var powerAssertText = lines.join('\n');
                    callback(powerOk, context, message, powerAssertText);
                }
            } else {
                baseAssert.ok(context);
            }
        };

        return {
            ok: powerOk,
            ident: ident,
            funcall: funcall,
            binary: binary,
            expr: expr
        };
    };
}));
