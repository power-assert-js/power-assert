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

    if (typeof define === 'function' && define.amd) {
        define(['./power-assert-events'], factory);
    } else if (typeof exports === 'object') {
        factory(require('./power-assert-events'));
    } else {
        factory(root._pa_);
    }
}(this, function (events) {
    'use strict';

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
        funcalls = [],
        binaries = [];

    var reset = function () {
        idents = [];
        funcalls = [];
        binaries = [];
    };

    events.on('ident', function (context) {
        idents.push(context);
    });

    events.on('funcall', function (context) {
        funcalls.push(context);
    });

    events.on('binary', function (context) {
        binaries.push(context);
    });

    events.on('truthy', function (context) {
        reset();
    });

    events.on('falsy', function (context) {
        events.emit('assert.fail', extend({idents: idents, funcalls: funcalls, binaries: binaries}, context));
        reset();
    });
}));
