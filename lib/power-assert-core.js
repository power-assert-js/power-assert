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

    var powerAssertCore = {};

    powerAssertCore.on = function (event, callback) {
        events.on(event, callback);
    };

    powerAssertCore.emit = function (event, context) {
        events.emit(event, context);
    };


    if (typeof exports !== 'undefined') {
        module.exports = powerAssertCore;
    } else {
        global['_pa_'] = powerAssertCore;
    }
})(this);
