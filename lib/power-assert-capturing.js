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

    var capturing = function (powerAssertCore) {
        var idents = [],
            funcalls = [];

        var reset = function () {
            idents = [];
            funcalls = [];
        };

        powerAssertCore.on('ident', function (context) {
            idents.push(context);
        });

        powerAssertCore.on('funcall', function (context) {
            funcalls.push(context);
        });

        powerAssertCore.on('truthy', function (context) {
            reset();
        });

        powerAssertCore.on('falsy', function (context) {
            idents.sort(rightToLeft);
            funcalls.sort(rightToLeft);
            powerAssertCore.emit('assert.fail', extend({idents: idents, funcalls: funcalls}, context));
            reset();
        });
    };


    if (typeof exports !== 'undefined') {
        module.exports = capturing;
    } else {
        capturing(global['_pa_']);
    }
})(this);
