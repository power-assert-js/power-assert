/**
 * power-assert.js - Power Assert in JavaScript.
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013-2015 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/power-assert/blob/master/MIT-LICENSE.txt
 */
'use strict';

var baseAssert = require('assert'),
    empower = require('empower'),
    formatter = require('power-assert-formatter'),
    extend = require('xtend'),
    empowerOptions = {modifyMessageOnRethrow: true, saveContextOnRethrow: true};

function customize (customOptions) {
    var options = customOptions || {};
    var poweredAssert = empower(
        baseAssert,
        formatter(options.output),
        extend(empowerOptions, options.assertion)
    );
    poweredAssert.customize = customize;
    return poweredAssert;
};

module.exports = customize();
