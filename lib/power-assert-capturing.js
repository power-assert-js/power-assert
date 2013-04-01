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

    var rightToLeft = function (a, b) {
        return b.start - a.start;
    };

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

    var idents = [],
        funcalls = [];

    var reset = function () {
        idents = [];
        funcalls = [];
    };

    events.on('ident', function (context) {
        idents.push(context);
    });

    events.on('funcall', function (context) {
        funcalls.push(context);
    });

    events.on('truthy', function (context) {
        reset();
    });

    events.on('falsy', function (context) {
        idents.sort(rightToLeft);
        funcalls.sort(rightToLeft);
        events.emit('assert.fail', extend({idents: idents, funcalls: funcalls}, context));
        reset();
    });
}));
