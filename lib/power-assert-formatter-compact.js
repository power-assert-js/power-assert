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

    var newRowFor = (function () {
        var createRow = function (numCols, initial) {
            var row = [], i;
            for(i = 0; i < numCols; i += 1) {
                row[i] = initial;
            }
            return row;
        };
        return function (assertionLine) {
            return createRow(assertionLine.length, ' ');
        };
    })();

    var isOverlapped = function (prevCapturing, nextCaputuring, dumpedValue) {
        return (typeof prevCapturing !== 'undefined') && prevCapturing.location.start.column <= (nextCaputuring.location.start.column + dumpedValue.length);
    };

    function CompactFormatter (assertionLine, assertionLocation, initialVertivalBarLength, dump, puts) {
        this.assertionLine = assertionLine;
        this.assertionLocation = assertionLocation;
        this.dump = dump;
        this.puts = puts;
        this.rows = [];
        for (var i = 0; i <= initialVertivalBarLength; i += 1) {
            this.addOneMoreRow();
        }
    }
    CompactFormatter.prototype.addOneMoreRow = function () {
        this.rows.push(newRowFor(this.assertionLine));
    };
    CompactFormatter.prototype.lastRow = function () {
        return this.rows[this.rows.length - 1];
    };
    CompactFormatter.prototype.renderVerticalBarAt = function (columnIndex) {
        var lastRowIndex = this.rows.length - 1;
        for (var i = 0; i < lastRowIndex; i += 1) {
            this.rows[i].splice(columnIndex, 1, '|');
        }
    };
    CompactFormatter.prototype.renderValueAt = function (columnIndex, dumpedValue) {
        for (var i = 0; i < dumpedValue.length; i += 1) {
            this.lastRow().splice(columnIndex + i, 1, dumpedValue.charAt(i));
        }
    };
    CompactFormatter.prototype.constructRows = function (capturedEvents) {
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
    CompactFormatter.prototype.format = function (capturedEvents) {
        var that = this;
        this.constructRows(capturedEvents);
        if (this.assertionLocation.path) {
            this.puts('# ' + [this.assertionLocation.path, this.assertionLocation.start.line].join(':'));
        } else {
            this.puts('# at line: ' + this.assertionLocation.start.line);
        }
        this.puts(this.assertionLine);
        this.rows.forEach(function (columns) {
            that.puts(columns.join(''));
        });
        this.puts('');
    };

    var rightToLeft = function (a, b) {
        return b.location.start.column - a.location.start.column;
    };

    powerAssert.on('assert.fail', function (context) {
        var capturedEvents = context.idents.concat(context.funcalls).concat(context.binaries),
            formatter = new CompactFormatter(context.content, context.location, 1, powerAssert.dump, powerAssert.puts);
        capturedEvents.sort(rightToLeft);
        formatter.format(capturedEvents);
    });
}));
