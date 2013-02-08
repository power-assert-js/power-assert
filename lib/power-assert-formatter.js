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
        var mat = [], i, j, row;
        for(i = 0; i < numRows; i += 1) {
            row = [];
            for(j = 0; j < numCols; j += 1) {
                row[j] = initial;
            }
            mat[i] = row;
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


    var formatter = function (powerAssertCore) {

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

        var formatIdentifiers = function (idents, line) {
            formatLines(idents, line, 2, powerAssertCore.dump).forEach(function (buffer) {
                powerAssertCore.puts(buffer.join(''));
            });
        };

        var formatFunctionCalls = function (funcalls, line) {
            funcalls.forEach(function (funcall) {
                formatLines([funcall], line, 2, powerAssertCore.dump).forEach(function (buffer) {
                    powerAssertCore.puts(buffer.join(''));
                });
            });
        };

        powerAssertCore.on('assert.fail', function (context) {
            var line = context.line,
                lineNumber = context.lineNumber,
                idents = context.idents,
                funcalls = context.funcalls;

            powerAssertCore.puts('# at line: ' + lineNumber);
            powerAssertCore.puts(line);
            formatIdentifiers(idents, line);
            formatFunctionCalls(funcalls, line);
            powerAssertCore.puts('');
        });
    };


    if (typeof exports !== 'undefined') {
        module.exports = formatter;
    } else {
        formatter(global['_pa_']);
    }
})(this);
