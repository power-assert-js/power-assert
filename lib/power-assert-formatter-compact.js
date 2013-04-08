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

    events.on('assert.fail', function (context) {
        // TODO get source content if strategy is other than 'inline'
        // TODO adjust location for binary expression is source is available
        var content = context.content,
            location = context.location,
            target = context.idents.concat(context.funcalls).concat(context.binaries);
        target.sort(rightToLeft);
        api.puts('# at line: ' + location.start.line);
        api.puts(content);
        formatLines(target, content, 1, api.dump).forEach(function (buffer) {
            api.puts(buffer.join(''));
        });
        api.puts('');
    });
}));
