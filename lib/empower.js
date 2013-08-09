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
        root.empower = factory(root.powerAssertCore, root.powerAssertFormatter);
    }
}(this, function (enhance, defaultFormatter) {
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


    function empowerAssertObject (assertObject, options) {
        extend(config, (options || {}));
        var origAssertObject = extend({}, assertObject);
        var coreApi = enhance(origAssertObject, config.formatter);
        extend(assertObject, coreApi);
        return assertObject;
    }


    function empowerAssertFunction (baseAssert, options) {
        extend(config, (options || {}));
        var coreApi = enhance(baseAssert, config.formatter);

        var powerAssert = function powerAssert (context, message) {
            coreApi.ok(context, message);
        };
        powerAssert.config = config;

        [
            'ok',
            'capture',
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
    }


    function empower (assert, options) {
        switch (typeof assert) {
        case 'function':
            return empowerAssertFunction(assert, options);
        case 'object':
            return empowerAssertObject(assert, options);
        default:
            throw new Error('Cannot be here');
        }
    }

    empower.enhance = enhance;

    return empower;
}));
