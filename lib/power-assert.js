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
    var _pa_ = {};

    _pa_.puts = function() { console.log.apply(console, arguments); };
    _pa_.dump = function (obj) {
        if (typeof obj === 'string') {
            return '"' + obj + '"';
        } else {
            return String(obj);
        }
    };

    var rightToLeft = function (a, b) {
        return b.start - a.start;
    };

    var createBuffers = function (numRows, numCols) {
        var bufs = [], i, j;
        for(i = 0; i < numRows; i += 1) {
            bufs.push([]);
        }
        for(j = 0; j < numCols; j += 1) {
            bufs.forEach(function (buffer) {
                buffer.push(' ');
            });
        }
        return bufs;
    };

    var formatLines = function (data, line, offset) {
        if (data.length === 0) {
            return createBuffers(0, 0);
        }
        var buffers = createBuffers(data.length + offset, line.length);
        data.forEach(function (cap) {
            for (var i = cap.start; i < cap.end; i += 1) {
                buffers[0].splice(i, 1, '^');
            }
        });
        data.forEach(function (cap, index) {
            var val = _pa_.dump(cap.value),
                bufOffset = index + offset;
            for (var i = 1; i < bufOffset; i += 1) {
                buffers[i].splice(cap.start, 1, '|');
            }
            buffers[bufOffset].splice(cap.start, val.length, val);
        });
        return buffers;
    };

    var report = function(idents, funcalls, line, lineNumber) {
        var identLines = formatLines(idents, line, 2);

        _pa_.puts('# at line: ' + lineNumber);
        _pa_.puts(line);
        identLines.forEach(function (buffer, index) {
            _pa_.puts(buffer.join(''));
        });
        funcalls.forEach(function (funcall) {
            formatLines([funcall], line, 2).forEach(function (buffer) {
                _pa_.puts(buffer.join(''));
            });
        });
        _pa_.puts('');
    };

    _pa_.report = report;

    (function () {
        var idents = [];
        var funcalls = [];

        _pa_.ident = function (value, start, end) {
            idents.push({
                value: value,
                start: start,
                end: end
            });
            return value;
        };

        _pa_.funcall = function (value, start, end) {
            funcalls.push({
                value: value,
                start: start,
                end: end
            });
            return value;
        };

        _pa_.expr = function (result, line, lineNumber) {
            if (result) {
                idents = [];
                funcalls = [];
                return result;
            }

            idents.sort(rightToLeft);
            funcalls.sort(rightToLeft);

            _pa_.report(idents, funcalls, line, lineNumber);

            idents = [];
            funcalls = [];
            return result;
        };
    })();


    if (typeof exports !== 'undefined') {
        module.exports = _pa_;
    } else {
        global['_pa_'] = _pa_;
    }
})(this);
