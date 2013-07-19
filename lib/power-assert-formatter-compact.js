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

    var newRowFor = function (line) {
        return row(line.length, ' ');
    };

    var createBuffer = function (offset, content) {
        var buffers = [], i;
        for (i = 0; i <= offset; i += 1) {
            buffers.push(newRowFor(content));
        }
        return buffers;
    };

    var formatLines = function (data, content, offset, dumper) {
        if (data.length === 0) {
            return [];
        }
        var buffers = createBuffer(offset, content),
            depth = 0,
            prev;
        data.forEach(function (cap) {
            var val = dumper(cap.value),
                bufOffset,
                i, j;
            if (typeof prev !== 'undefined' && prev.location.start.column <= cap.location.start.column + val.length) {
                depth += 1;
                buffers.push(newRowFor(content));
            }
            bufOffset = depth + offset;
            for (i = 0; i < bufOffset; i += 1) {
                buffers[i].splice(cap.location.start.column, 1, '|');
            }
            for (j = 0; j < val.length; j += 1) {
                buffers[bufOffset].splice(cap.location.start.column + j, 1, val.charAt(j));
            }
            prev = cap;
        });
        return buffers;
    };

    var rightToLeft = function (a, b) {
        return b.location.start.column - a.location.start.column;
    };

    powerAssert.on('assert.fail', function (context) {
        var content = context.content,
            location = context.location,
            target = context.idents.concat(context.funcalls).concat(context.binaries);
        target.sort(rightToLeft);
        powerAssert.puts('# at line: ' + location.start.line);
        powerAssert.puts(content);
        formatLines(target, content, 1, powerAssert.dump).forEach(function (buffer) {
            powerAssert.puts(buffer.join(''));
        });
        powerAssert.puts('');
    });
}));
