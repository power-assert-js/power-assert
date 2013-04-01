/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
(function () {
    if (typeof exports !== 'undefined') {
        var powerAssertCore = require('./power-assert-core'),
            api = require('./power-assert-api'),
            output = require('./power-assert-output'),
            capturing = require('./power-assert-capturing'),
            formatter = require('./power-assert-formatter');
        api(powerAssertCore);
        powerAssertCore.useDefault = function () {
            capturing(powerAssertCore);
            formatter(powerAssertCore);
            output(powerAssertCore);
        };
        module.exports = powerAssertCore;
    }
})();
