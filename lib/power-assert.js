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
        var powerAssert = require('./power-assert-api');
        powerAssert.useDefault = function () {
            require('./power-assert-collector');
            require('./power-assert-formatter-compact');
            return powerAssert;
        };
        module.exports = powerAssert;
    }
})();
