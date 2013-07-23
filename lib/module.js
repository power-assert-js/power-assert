/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 */
(function () {
    if (typeof exports !== 'undefined') {
        var powerAssertModule = require('./power-assert');
        powerAssertModule.empowerQUnit = require('./power-assert-qunit');
        module.exports = powerAssertModule;
    }
})();
