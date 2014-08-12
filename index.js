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
    formatter = require('power-assert-formatter');

module.exports = empower(baseAssert, formatter(), {modifyMessageOnRethrow: true, saveContextOnRethrow: true});
