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
        var events = require('./power-assert-event-bus');
        factory(exports, events);
    } else {
        factory(root._pa_, root._pa_.events);
    }

}(this, function (exports, events) {
    'use strict';

    exports.ident = function (value, location) {
        events.emit('ident', {value: value, location: location});
        return value;
    };

    exports.funcall = function (value, location) {
        events.emit('funcall', {value: value, location: location});
        return value;
    };

    exports.binary = function (value, location) {
        events.emit('binary', {value: value, location: location});
        return value;
    };

    exports.expr = function (result, location, content) {
        var context = {result: result, location: location, content: content};
        if (result) {
            events.emit('truthy', context);
        } else {
            events.emit('falsy', context);
        }
        return result;
    };

    exports.puts = function() {
        console.log.apply(console, arguments);
    };

    exports.dump = function (obj) {
        return JSON.stringify(obj);
    };
}));
