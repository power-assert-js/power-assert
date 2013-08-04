/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 */
(function (root, factory) {
    'use strict';

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.powerAssertFormatter = factory();
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

    function rightToLeft (a, b) {
        return b.location.start.column - a.location.start.column;
    }

    function PowerAssertContextRenderer (dump, context) {
        this.dump = dump;
        this.initialVertivalBarLength = 1;
        this.initWithContext(context);
    }
    PowerAssertContextRenderer.prototype.initWithContext = function (context) {
        context.events.sort(rightToLeft);
        this.events = context.events;
        this.assertionLine = context.content;
        this.assertionLocation = context.location;
        this.rows = [];
        for (var i = 0; i <= this.initialVertivalBarLength; i += 1) {
            this.addOneMoreRow();
        }
    };
    PowerAssertContextRenderer.prototype.addOneMoreRow = function () {
        this.rows.push(newRowFor(this.assertionLine));
    };
    PowerAssertContextRenderer.prototype.lastRow = function () {
        return this.rows[this.rows.length - 1];
    };
    PowerAssertContextRenderer.prototype.renderVerticalBarAt = function (columnIndex) {
        var lastRowIndex = this.rows.length - 1;
        for (var i = 0; i < lastRowIndex; i += 1) {
            this.rows[i].splice(columnIndex, 1, '|');
        }
    };
    PowerAssertContextRenderer.prototype.renderValueAt = function (columnIndex, dumpedValue) {
        var width = widthOf(dumpedValue);
        for (var i = 0; i < width; i += 1) {
            this.lastRow().splice(columnIndex + i, 1, dumpedValue.charAt(i));
        }
    };
    PowerAssertContextRenderer.prototype.constructRows = function (capturedEvents) {
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
    PowerAssertContextRenderer.prototype.renderLines = function () {
        var lines = [];
        this.constructRows(this.events);
        if (this.assertionLocation.path) {
            lines.push('# ' + [this.assertionLocation.path, this.assertionLocation.start.line].join(':'));
        } else {
            lines.push('# at line: ' + this.assertionLocation.start.line);
        }
        lines.push('');
        lines.push(this.assertionLine);
        this.rows.forEach(function (columns) {
            lines.push(columns.join(''));
        });
        lines.push('');
        return lines;
    };

    return {
        dump: function (obj) {
            return JSON.stringify(obj);
        },
        format: function (context) {
            var renderer = new PowerAssertContextRenderer(this.dump, context);
            return renderer.renderLines();
        },
        PowerAssertContextRenderer: PowerAssertContextRenderer
    };
}));
