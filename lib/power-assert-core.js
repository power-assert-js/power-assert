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
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root._pa_ = factory();
    }
}(this, function () {
    'use strict';

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

    return {
        on: function (event, callback) {
            events.on(event, callback);
        },
        emit: function (event, context) {
            events.emit(event, context);
        },
        ident: function (value, location) {
            events.emit('ident', {value: value, location: location});
            return value;
        },
        funcall: function (value, location) {
            events.emit('funcall', {value: value, location: location});
            return value;
        },
        binary: function (value, location) {
            events.emit('binary', {value: value, location: location});
            return value;
        },
        expr: function (result, location, content) {
            var context = {result: result, location: location, content: content};
            if (result) {
                events.emit('truthy', context);
            } else {
                events.emit('falsy', context);
            }
            return result;
        },
        puts: function() {
            console.log.apply(console, arguments);
        },
        dump: function (obj) {
            return JSON.stringify(obj);
        }
    };
}));
