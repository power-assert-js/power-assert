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
    var _pa_ = {};

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

    _pa_.events = events;

    _pa_.ident = function (value, start, end) {
        events.emit('ident', value, start, end);
        return value;
    };

    _pa_.funcall = function (value, start, end) {
        events.emit('funcall', value, start, end);
        return value;
    };

    _pa_.expr = function (result, line, lineNumber) {
        if (result) {
            events.emit('truthy', result, line, lineNumber);
        } else {
            events.emit('falsy', result, line, lineNumber);
        }
        return result;
    };


    if (typeof exports !== 'undefined') {
        module.exports = _pa_;
    } else {
        global['_pa_'] = _pa_;
    }
})(this);
