(function (global) {
    var powerAssert = {},
        captured = [];

    var escapeLineEndings = function (str) {
        return str.replace(/(\r?\n)/g, '$&# ');
    };

    var note = function (obj) {
        console.log(escapeLineEndings('# ' + obj));
    };

    var explain = function (obj) {
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


    powerAssert.__ident__ = function (name, value, start, end) {
        captured.push({
            name: name,
            value: value,
            start: start,
            end: end
        });
        return value;
    };


    powerAssert.__expr__ = function (result, line) {
        if (result) {
            captured = [];
            return result;
        }

        captured.sort(function (a, b) {
            return b.start - a.start;
        });

        var buffers = createBuffers(captured.length + 2, line.length);

        captured.forEach(function (cap) {
            for(var i = cap.start; i < cap.end; i += 1) {
                buffers[0].splice(i, 1, '^');
            }
        });

        captured.forEach(function (cap, index) {
            var val = explain(cap.value),
                offset = index + 2;
            for(var i = 1; i < offset; i += 1) {
                buffers[i].splice(cap.start, 1, '|');
            }
            buffers[offset].splice(cap.start, val.length, val);
        });

        note('');
        note(line);
        buffers.forEach(function (buffer, index) {
            note(buffer.join(''));
        });

        captured = [];
        return result;
    };


    /*global exports:false*/
    if (typeof exports !== 'undefined') {
        module.exports = powerAssert;
    } else {
        global['powerAssert'] = powerAssert;
    }
})(this);
