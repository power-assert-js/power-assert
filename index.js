/**
 * power-assert.js - Power Assert in JavaScript.
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013-2014 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/power-assert/blob/master/MIT-LICENSE.txt
 */
'use strict';

var baseAssert = require('assert'),
    empower = require('empower'),
    formatter = require('power-assert-formatter'),
    extend = require('xtend'),
    empowerOptions = {modifyMessageOnRethrow: true, saveContextOnRethrow: true};

var poweredAssert = empower(baseAssert, formatter(), empowerOptions);

poweredAssert.customize = function (customOptions) {
    return empower(baseAssert, formatter(customOptions.formatter), extend(empowerOptions, customOptions.empower));
};

module.exports = poweredAssert;
