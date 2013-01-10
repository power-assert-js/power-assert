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

    var report = function(idents, funcalls, line, lineNumber) {
        var buffers = createBuffers(idents.length + 2, line.length);

        idents.forEach(function (cap) {
            for (var i = cap.start; i < cap.end; i += 1) {
                buffers[0].splice(i, 1, '^');
            }
        });

        idents.forEach(function (cap, index) {
            var val = _pa_.dump(cap.value),
                offset = index + 2;
            for (var i = 1; i < offset; i += 1) {
                buffers[i].splice(cap.start, 1, '|');
            }
            buffers[offset].splice(cap.start, val.length, val);
        });

        _pa_.puts('# at line: ' + lineNumber);
        _pa_.puts(line);
        buffers.forEach(function (buffer, index) {
            _pa_.puts(buffer.join(''));
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

            idents.sort(function (a, b) {
                return b.start - a.start;
            });
            funcalls.sort(function (a, b) {
                return b.start - a.start;
            });

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
