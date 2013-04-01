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

    var output = function (powerAssertCore) {
        powerAssertCore.puts = function() {
            console.log.apply(console, arguments);
        };

        powerAssertCore.dump = function (obj) {
            if (typeof obj === 'string') {
                return '"' + obj + '"';
            } else {
                return String(obj);
            }
        };
    };


    if (typeof exports !== 'undefined') {
        module.exports = output;
    } else {
        output(global['_pa_']);
    }
})(this);
