var q = require('qunitjs'),
    util = require('util');

var __current__ = [];

var __ident__ = function (name, value, start, end) {
    __current__.push({
        name: name,
        value: value,
        start: start,
        end: end
    });
    return value;
};

var __assert__ = function (result, line) {
    if (result) {
        __current__ = [];
        return;
    }

    var createBuffers = function (numRows, numCols) {
        var bufs = [], i, j;
        for(i = 0; i <= numRows; i += 1) {
            bufs.push([]);
        }
        bufs.push([]);
        for(j = 0; j < numCols; j += 1) {
            bufs.forEach(function (buffer) {
                buffer.push(' ');
            });
        }
        return bufs;
    };

    var buffers = createBuffers(__current__.length, line.length);

    __current__.sort(function (a, b) {
        return b.start - a.start;
    });

    __current__.forEach(function (tok, index) {
        for(var j = tok.start; j < tok.end; j += 1) {
            buffers[0].splice(j, 1, '^');
        }
    });

    __current__.forEach(function (tok, index) {
        //var val = String(tok.value),
        var val = q.tap.explain(tok.value),
            offset = index + 2;
        for(var i = 1; i < offset; i += 1) {
            buffers[i].splice(tok.start, 1, '|');
        }
        buffers[offset].splice(tok.start, val.length, val);
    });

    q.tap.note(line);
    buffers.forEach(function (buffer, index) {
        q.tap.note(buffer.join(''));
    });
    q.tap.note('');

    __current__ = [];
};

(function (qunitObject) {
    var qunitTap = require("qunit-tap").qunitTap;
    qunitTap(qunitObject, util.puts, {noPlan: true, showSourceOnFailure: true});
    qunitObject.init();
    qunitObject.config.updateRate = 0;
})(q);


q.test('spike', function (assert) {
    var hoge = 'foo';
    var fuga = 'bar';
    assert.ok(hoge === fuga, 'comment');

    var piyo = 3;
    assert.ok(fuga === piyo);

    var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    assert.ok(longString === anotherLongString);
});
