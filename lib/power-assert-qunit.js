/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 */
(function (root, factory) {
    'use strict';

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(['./power-assert-core', './power-assert-formatter'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('./power-assert-core'), require('./power-assert-formatter'));
    } else {
        root.empowerQUnit = factory(root.empowerAssert, root.powerAssertFormatter);
    }
}(this, function (enhancer, defaultFormatter) {
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

    var config = {
        formatter: defaultFormatter
    };

    return function (qunit, options) {
        extend(config, (options || {}));
        var origQUnitAssert = extend({}, qunit.assert);
        var coreApi = enhancer(origQUnitAssert, function (powerOk, context, message) {
            var powerAssertText = config.formatter.format(context).join('\n');
            origQUnitAssert.ok(context.result, message ? message + ' ' + powerAssertText : powerAssertText);
        });
        extend(qunit.assert, coreApi);
        return qunit;
    };
}));
