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

    if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        root._pa_ = root._pa_ || {};
        root._pa_.events = root._pa_.events || {};
        factory(root._pa_.events);
    }

}(this, function (exports) {
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

    exports.on = function (event, callback) {
        events.on(event, callback);
    };
    exports.emit = function (event, context) {
        events.emit(event, context);
    };
}));
