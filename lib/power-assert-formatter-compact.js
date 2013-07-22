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

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.PowerAssertCompactFormatter = factory();
    }
}(this, function () {
    'use strict';

    var widthOf = function (str) {
        var i, c, width = 0;
        for(i = 0; i < str.length; i+=1){
            c = str.charCodeAt(i);
            if ((0x0 <= c && c < 0x81) || (c == 0xf8f0) || (0xff61 <= c && c < 0xffa0) || (0xf8f1 <= c && c < 0xf8f4)) {
                width += 1;
            } else {
                width += 2;
            }
        }
        return width;
    };

    var newRowFor = (function () {
        var createRow = function (numCols, initial) {
            var row = [], i;
            for(i = 0; i < numCols; i += 1) {
                row[i] = initial;
            }
            return row;
        };
        return function (assertionLine) {
            return createRow(widthOf(assertionLine), ' ');
        };
    })();

    var isOverlapped = function (prevCapturing, nextCaputuring, dumpedValue) {
        return (typeof prevCapturing !== 'undefined') && prevCapturing.location.start.column <= (nextCaputuring.location.start.column + widthOf(dumpedValue));
    };

    function PowerAssertCompactFormatter (dump, puts) {
        this.dump = dump;
        this.puts = puts;
        this.initialVertivalBarLength = 1;
    }
    PowerAssertCompactFormatter.prototype.addOneMoreRow = function () {
        this.rows.push(newRowFor(this.assertionLine));
    };
    PowerAssertCompactFormatter.prototype.lastRow = function () {
        return this.rows[this.rows.length - 1];
    };
    PowerAssertCompactFormatter.prototype.renderVerticalBarAt = function (columnIndex) {
        var lastRowIndex = this.rows.length - 1;
        for (var i = 0; i < lastRowIndex; i += 1) {
            this.rows[i].splice(columnIndex, 1, '|');
        }
    };
    PowerAssertCompactFormatter.prototype.renderValueAt = function (columnIndex, dumpedValue) {
        var width = widthOf(dumpedValue);
        for (var i = 0; i < width; i += 1) {
            this.lastRow().splice(columnIndex + i, 1, dumpedValue.charAt(i));
        }
    };
    PowerAssertCompactFormatter.prototype.constructRows = function (capturedEvents) {
        var that = this,
            prevCaptured;
        capturedEvents.forEach(function (captured) {
            var dumpedValue = that.dump(captured.value);
            if (isOverlapped(prevCaptured, captured, dumpedValue)) {
                that.addOneMoreRow();
            }
            that.renderVerticalBarAt(captured.location.start.column);
            that.renderValueAt(captured.location.start.column, dumpedValue);
            prevCaptured = captured;
        });
    };
    PowerAssertCompactFormatter.prototype.format = function (assertionLine, assertionLocation, capturedEvents) {
        var that = this;
        this.rows = [];
        this.assertionLine = assertionLine;
        this.assertionLocation = assertionLocation;
        for (var i = 0; i <= this.initialVertivalBarLength; i += 1) {
            this.addOneMoreRow();
        }
        this.constructRows(capturedEvents);
        if (this.assertionLocation.path) {
            this.puts('# ' + [this.assertionLocation.path, this.assertionLocation.start.line].join(':'));
        } else {
            this.puts('# at line: ' + this.assertionLocation.start.line);
        }
        this.puts('');
        this.puts(this.assertionLine);
        this.rows.forEach(function (columns) {
            that.puts(columns.join(''));
        });
        this.puts('');
    };

    return PowerAssertCompactFormatter;
}));
