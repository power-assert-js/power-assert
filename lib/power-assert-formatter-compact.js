/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['./power-assert-core'], factory);
    } else if (typeof exports === 'object') {
        factory(require('./power-assert-core'));
    } else {
        factory(root._pa_);
    }
}(this, function (powerAssert) {
    'use strict';

    var row = function (numCols, initial) {
        var row = [], i;
        for(i = 0; i < numCols; i += 1) {
            row[i] = initial;
        }
        return row;
    };

    var newRowFor = function (assertionLine) {
        return row(assertionLine.length, ' ');
    };

    var createBuffer = function (offset, assertionLine) {
        var buffers = [], i;
        for (i = 0; i <= offset; i += 1) {
            buffers.push(newRowFor(assertionLine));
        }
        return buffers;
    };

    var interleaves = function (prevCapturing, nextCaputuring, val) {
        return (typeof prevCapturing !== 'undefined') && prevCapturing.location.start.column <= (nextCaputuring.location.start.column + val.length);
    };

    var formatLines = function (capturedEvents, assertionLine, offset, dumper) {
        if (capturedEvents.length === 0) {
            return [];
        }
        var buffers = createBuffer(offset, assertionLine),
            prevCaptured;
        capturedEvents.forEach(function (captured) {
            var val = dumper(captured.value),
                lastLineIndex,
                i, j;
            if (interleaves(prevCaptured, captured, val)) {
                buffers.push(newRowFor(assertionLine));
            }
            lastLineIndex = buffers.length - 1;
            for (i = 0; i < lastLineIndex; i += 1) {
                buffers[i].splice(captured.location.start.column, 1, '|');
            }
            for (j = 0; j < val.length; j += 1) {
                buffers[lastLineIndex].splice(captured.location.start.column + j, 1, val.charAt(j));
            }
            prevCaptured = captured;
        });
        return buffers;
    };

    var rightToLeft = function (a, b) {
        return b.location.start.column - a.location.start.column;
    };

    powerAssert.on('assert.fail', function (context) {
        var line = context.content,
            location = context.location,
            target = context.idents.concat(context.funcalls).concat(context.binaries);
        target.sort(rightToLeft);
        powerAssert.puts('# at line: ' + location.start.line);
        powerAssert.puts(line);
        formatLines(target, line, 1, powerAssert.dump).forEach(function (buffer) {
            powerAssert.puts(buffer.join(''));
        });
        powerAssert.puts('');
    });
}));
