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
        var events = require('./power-assert-core');
        factory(exports, events);
    } else {
        factory(root._pa_, root._pa_.events);
    }

}(this, function (exports, events) {
    'use strict';

    exports.ident = function (value, start, end) {
        events.emit('ident', {value: value, start: start, end: end});
        return value;
    };

    exports.funcall = function (value, start, end) {
        events.emit('funcall', {value: value, start: start, end: end});
        return value;
    };

    exports.expr = function (result, line, lineNumber) {
        var context = {result: result, line: line, lineNumber: lineNumber};
        if (result) {
            events.emit('truthy', context);
        } else {
            events.emit('falsy', context);
        }
        return result;
    };
}));
