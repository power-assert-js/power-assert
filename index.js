/**
 * power-assert.js - Power Assert in JavaScript.
 *
 * https://github.com/power-assert-js/power-assert
 *
 * Copyright (c) 2013-2017 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/power-assert-js/power-assert/blob/master/MIT-LICENSE.txt
 */
'use strict';

var baseAssert = require('assert');
var _deepEqual = require('universal-deep-strict-equal');
var empower = require('empower');
var formatter = require('power-assert-formatter');
var extend = require('xtend');
var define = require('define-properties');
var empowerOptions = {
    modifyMessageOnRethrow: true,
    saveContextOnRethrow: true
};

if (typeof baseAssert.deepStrictEqual !== 'function') {
    baseAssert.deepStrictEqual = function deepStrictEqual (actual, expected, message) {
        if (!_deepEqual(actual, expected, true)) {
            baseAssert.fail(actual, expected, message, 'deepStrictEqual');
        }
    };
}
if (typeof baseAssert.notDeepStrictEqual !== 'function') {
    baseAssert.notDeepStrictEqual = function notDeepStrictEqual (actual, expected, message) {
        if (_deepEqual(actual, expected, true)) {
            baseAssert.fail(actual, expected, message, 'notDeepStrictEqual');
        }
    };
}

function customize (customOptions) {
    var options = customOptions || {};
    var poweredAssert = empower(
        baseAssert,
        formatter(options.output),
        extend(empowerOptions, options.assertion)
    );
    poweredAssert.customize = customize;
    return poweredAssert;
}

var defaultAssert = customize();
define(defaultAssert, { '__esModule': true });
defaultAssert['default'] = defaultAssert;
module.exports = defaultAssert;
