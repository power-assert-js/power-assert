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

    powerAssertCore.puts = function() {
        console.log.apply(console, arguments);
    };

    powerAssertCore.dump = function (obj) {
        if (typeof obj === 'string') {
            return '"' + obj + '"';
        } else {
            return String(obj);
        }
    };

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
            emit: function (event) {
                var args = Array.prototype.slice.apply(arguments).slice(1);
                var handlers = registry[event];
                if (typeof handlers === 'undefined') {
                    return;
                }
                handlers.forEach(function (handler) {
                    handler.apply(null, args);
                });
            }
        };
    })();

    powerAssertCore.on = function (event, callback) {
        events.on(event, callback);
    };

    powerAssertCore.ident = function (value, start, end) {
        events.emit('ident', value, start, end);
        return value;
    };

    powerAssertCore.funcall = function (value, start, end) {
        events.emit('funcall', value, start, end);
        return value;
    };

    powerAssertCore.expr = function (result, line, lineNumber) {
        if (result) {
            events.emit('truthy', result, line, lineNumber);
        } else {
            events.emit('falsy', result, line, lineNumber);
        }
        return result;
    };


    if (typeof exports !== 'undefined') {
        module.exports = powerAssertCore;
    } else {
        global['_pa_'] = powerAssertCore;
    }
})(this);
