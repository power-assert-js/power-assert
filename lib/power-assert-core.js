/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
(function (global) {
    var powerAssertCore = {};

    var events = (function () {
        var registry = {};
        return {
            on: function (event, callback) {
                if (typeof registry[event] === 'undefined') {
                    registry[event] = [];
                }
                var handlers = registry[event];
                handlers.push(callback);
            },
            emit: function (event, context) {
                var handlers = registry[event];
                if (typeof handlers === 'undefined') {
                    return;
                }
                handlers.forEach(function (handler) {
                    handler.call(null, context);
                });
            }
        };
    })();

    powerAssertCore.on = function (event, callback) {
        events.on(event, callback);
    };

    powerAssertCore.emit = function (event, context) {
        events.emit(event, context);
    };

    powerAssertCore.ident = function (value, start, end) {
        events.emit('ident', {value: value, start: start, end: end});
        return value;
    };

    powerAssertCore.funcall = function (value, start, end) {
        events.emit('funcall', {value: value, start: start, end: end});
        return value;
    };

    powerAssertCore.expr = function (result, line, lineNumber) {
        var context = {result: result, line: line, lineNumber: lineNumber};
        if (result) {
            events.emit('truthy', context);
        } else {
            events.emit('falsy', context);
        }
        return result;
    };


    if (typeof exports !== 'undefined') {
        module.exports = powerAssertCore;
    } else {
        global['_pa_'] = powerAssertCore;
    }
})(this);
