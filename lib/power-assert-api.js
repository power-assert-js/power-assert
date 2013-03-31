/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
(function (global) {
    var api = function (powerAssertCore) {
        powerAssertCore.ident = function (value, start, end) {
            powerAssertCore.emit('ident', {value: value, start: start, end: end});
            return value;
        };

        powerAssertCore.funcall = function (value, start, end) {
            powerAssertCore.emit('funcall', {value: value, start: start, end: end});
            return value;
        };

        powerAssertCore.expr = function (result, line, lineNumber) {
            var context = {result: result, line: line, lineNumber: lineNumber};
            if (result) {
                powerAssertCore.emit('truthy', context);
            } else {
                powerAssertCore.emit('falsy', context);
            }
            return result;
        };
    };


    if (typeof exports !== 'undefined') {
        module.exports = api;
    } else {
        api(global['_pa_']);
    }
})(this);
