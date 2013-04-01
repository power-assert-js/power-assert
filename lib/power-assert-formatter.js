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
        var api = require('./power-assert-api');
        var events = require('./power-assert-event-bus');
        factory(exports, events, api);
    } else {
        factory(root._pa_, root._pa_.events, root._pa_);
    }

}(this, function (exports, events, api) {
    'use strict';

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

    var formatIdentLines = function (data, line, offset, dumper) {
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
            for (var i = 0; i < val.length; i += 1) {
                buffers[bufOffset].splice(cap.start + i, 1, val.charAt(i));
            }
        });
        return buffers;
    };

    var formatFuncallLines = function (cap, line, offset, dumper, identBuffers, funcallBuffers) {
        var buffers = matrix(1 + offset, line.length, ' ');
        for (var i = cap.start; i < cap.end; i += 1) {
            buffers[0].splice(i, 1, '^');
        }
        var val = dumper(cap.value);
        for (var i = 1; i < offset; i += 1) {
            buffers[i].splice(cap.start, 1, '|');
            //buffers[i].splice(cap.end - 1, 1, '|');
        }
        for (var i = 0; i < val.length; i += 1) {
            buffers[offset].splice(cap.start + i, 1, val.charAt(i));
        }

        // identBuffers.forEach(function (buffer) {
        //     buffer.splice(cap.start, 1, '|');
        //     //buffer.splice(cap.end - 1, 1, '|');
        // });
        // funcallBuffers.forEach(function (buffer) {
        //     buffer.splice(cap.start, 1, '|');
        //     //buffer.splice(cap.end - 1, 1, '|');
        // });

        return buffers;
    };


    events.on('assert.fail', function (context) {
        var line = context.line,
            lineNumber = context.lineNumber,
            idents = context.idents,
            funcalls = context.funcalls;

        api.puts('# at line: ' + lineNumber);
        api.puts(line);

        var identBuffers = formatIdentLines(idents, line, 2, api.dump);

        var funcallBuffers = [];
        funcalls.forEach(function (funcall) {
            funcallBuffers = funcallBuffers.concat(formatFuncallLines(funcall, line, 2, api.dump, identBuffers, funcallBuffers));
        });

        identBuffers.forEach(function (buffer) {
            api.puts(buffer.join(''));
        });
        funcallBuffers.forEach(function (buffer) {
            api.puts(buffer.join(''));
        });
        api.puts('');
    });
}));
