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
        define(['assert', './power-assert-core'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('assert'), require('./power-assert-core'));
    } else {
        root.assert = factory(root.assert, root.empowerAssert);
    }
}(this, function (baseAssert, enhancer) {
    'use strict';

    var coreApi = enhancer(baseAssert, function (powerOk, context, message, powerAssertText) {
        throw new baseAssert.AssertionError({
            message: message ? message + ' ' + powerAssertText : powerAssertText,
            stackStartFunction: powerOk
        });
    });

    var powerAssert = function (context, message) {
        coreApi.ok(context, message);
    };

    [
        'ok',
        'ident',
        'funcall',
        'binary',
        'expr'
    ].forEach(function (name) {
        if (typeof coreApi[name] === 'function') {
            powerAssert[name] = coreApi[name];
        }
    });

    [
        'fail',
        // 'ok',   // use empowered ok function
        'equal',
        'notEqual',
        'deepEqual',
        'notDeepEqual',
        'strictEqual',
        'notStrictEqual',
        'throws',
        'doesNotThrow',
        'ifError'
    ].forEach(function (name) {
        if (typeof baseAssert[name] === 'function') {
            powerAssert[name] = baseAssert[name];
        }
    });

    return powerAssert;
}));
