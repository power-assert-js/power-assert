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


    var events = (function () {
        var registry = {};
        return {
            on: function (event, callback) {
                if (typeof registry[event] === 'undefined') {
                    registry[event] = [];
                }
                var handlers = registry[event];
                handlers.push(callback);
            },
            emit: function (event) {
                var args = Array.prototype.slice.apply(arguments).slice(1);
                var handlers = registry[event];
                if (typeof handlers === 'undefined') {
                    return;
                }
                handlers.forEach(function (handler) {
                    handler.apply(null, args);
                });
            }
        };
    })();


    var puts = function() {
        console.log.apply(console, arguments);
    };
    _pa_.puts = puts;


    var dump = function (obj) {
        if (typeof obj === 'string') {
            return '"' + obj + '"';
        } else {
            return String(obj);
        }
    };
    _pa_.dump = dump;


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


    var formatLines = function (data, line, offset) {
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
        _pa_.puts('# at line: ' + lineNumber);
        _pa_.puts(line);

        formatLines(idents, line, 2).forEach(function (buffer) {
            _pa_.puts(buffer.join(''));
        });

        funcalls.forEach(function (funcall) {
            formatLines([funcall], line, 2).forEach(function (buffer) {
                _pa_.puts(buffer.join(''));
            });
        });

        _pa_.puts('');
    };


    (function () {
        var idents = [];
        var funcalls = [];

        var rightToLeft = function (a, b) {
            return b.start - a.start;
        };

        events.on('ident', function (value, start, end) {
            idents.push({
                value: value,
                start: start,
                end: end
            });
        });

        events.on('funcall', function (value, start, end) {
            funcalls.push({
                value: value,
                start: start,
                end: end
            });
        });

        events.on('truthy', function (result, line, lineNumber) {
            idents = [];
            funcalls = [];
        });

        events.on('falsy', function (result, line, lineNumber) {
            idents.sort(rightToLeft);
            funcalls.sort(rightToLeft);
            report(idents, funcalls, line, lineNumber);
            idents = [];
            funcalls = [];
        });
    })();


    _pa_.ident = function (value, start, end) {
        events.emit('ident', value, start, end);
        return value;
    };

    _pa_.funcall = function (value, start, end) {
        events.emit('funcall', value, start, end);
        return value;
    };

    _pa_.expr = function (result, line, lineNumber) {
        if (result) {
            events.emit('truthy', result, line, lineNumber);
        } else {
            events.emit('falsy', result, line, lineNumber);
        }
        return result;
    };

    if (typeof exports !== 'undefined') {
        module.exports = _pa_;
    } else {
        global['_pa_'] = _pa_;
    }
})(this);
