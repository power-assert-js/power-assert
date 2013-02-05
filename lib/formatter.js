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

    var matrix = function (numRows, numCols, initial) {
        var mat = [], i, j, a;
        for(i = 0; i < numRows; i += 1) {
            a = [];
            for(j = 0; j < numCols; j += 1) {
                a[j] = initial;
            }
            mat[i] = a;
        }
        return mat;
    };

    var formatLines = function (data, line, offset, dumper) {
        if (data.length === 0) {
            return matrix(0, 0, ' ');
        }
        var buffers = matrix(data.length + offset, line.length, ' ');
        data.forEach(function (cap) {
            for (var i = cap.start; i < cap.end; i += 1) {
                buffers[0].splice(i, 1, '^');
            }
        });
        data.forEach(function (cap, index) {
            var val = dumper(cap.value),
                bufOffset = index + offset;
            for (var i = 1; i < bufOffset; i += 1) {
                buffers[i].splice(cap.start, 1, '|');
            }
            buffers[bufOffset].splice(cap.start, val.length, val);
        });
        return buffers;
    };

    var rightToLeft = function (a, b) {
        return b.start - a.start;
    };


    var formatter = function (powerAssertCore) {
        var idents = [],
            funcalls = [];

        var reset = function () {
            idents = [];
            funcalls = [];
        };

        powerAssertCore.on('ident', function (value, start, end) {
            idents.push({
                value: value,
                start: start,
                end: end
            });
        });

        powerAssertCore.on('funcall', function (value, start, end) {
            funcalls.push({
                value: value,
                start: start,
                end: end
            });
        });

        powerAssertCore.on('truthy', function (result, line, lineNumber) {
            reset();
        });

        powerAssertCore.on('falsy', function (result, line, lineNumber) {
            idents.sort(rightToLeft);
            funcalls.sort(rightToLeft);

            powerAssertCore.puts('# at line: ' + lineNumber);
            powerAssertCore.puts(line);
            formatLines(idents, line, 2, powerAssertCore.dump).forEach(function (buffer) {
                powerAssertCore.puts(buffer.join(''));
            });
            funcalls.forEach(function (funcall) {
                formatLines([funcall], line, 2, powerAssertCore.dump).forEach(function (buffer) {
                    powerAssertCore.puts(buffer.join(''));
                });
            });
            powerAssertCore.puts('');

            reset();
        });
    };


    if (typeof exports !== 'undefined') {
        module.exports = formatter;
    } else {
        formatter(global['_pa_']);
    }
})(this);
