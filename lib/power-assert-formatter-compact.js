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

    if (typeof exports !== 'undefined') {
        var powerAssert = require('./power-assert');
        factory(powerAssert);
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

    var formatLines = function (data, content, offset, dumper) {
        if (data.length === 0) {
            return [];
        }
        var buffers = [],
            depth = 0,
            prev;
        for (var i = 0; i <= offset; i += 1) {
            buffers.push(newRowFor(content));
        }
        data.forEach(function (cap) {
            var val = dumper(cap.value);
            if (typeof prev !== 'undefined' && prev.location.start.column <= cap.location.start.column + val.length) {
                depth += 1;
                buffers.push(newRowFor(content));
            }
            var bufOffset = depth + offset;
            for (var i = 0; i < bufOffset; i += 1) {
                buffers[i].splice(cap.location.start.column, 1, '|');
            }
            for (var i = 0; i < val.length; i += 1) {
                buffers[bufOffset].splice(cap.location.start.column + i, 1, val.charAt(i));
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
