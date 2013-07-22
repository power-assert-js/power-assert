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
        var powerAssertModule = {};
        powerAssertModule.useEvents = function () {
            var events = require('./power-assert-events');
            require('./power-assert-collector');
            var PowerAssertCompactFormatter = require('./power-assert-formatter-compact');
            var rightToLeft = function (a, b) {
                return b.location.start.column - a.location.start.column;
            };
            events.on('assert.fail', function (context) {
                var capturedEvents = context.idents.concat(context.funcalls).concat(context.binaries),
                    formatter = new PowerAssertCompactFormatter(events.dump, events.puts);
                capturedEvents.sort(rightToLeft);
                formatter.format(context.content, context.location, capturedEvents);
            });
            return events;
        };
        module.exports = powerAssertModule;
    }
})();
