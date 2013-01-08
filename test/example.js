var q = require('qunitjs'),
    util = require('util');

var __current__ = [];
var __save__ = function (name, value, start, end) {
    __current__.push({
        name: name,
        value: value,
        start: start,
        end: end
        //loc: loc
    });
    return value;
};
var __assert__ = function (result, line) {
    if (result) {
        __current__ = [];
        return;
    }
    var buffers = (function () {
        var buffers = [], i, j;
        for(i = 0; i < __current__.length; i += 1) {
            buffers.push([]);
        }
        buffers.push([]);
        for(j = 0; j < line.length; j += 1) {
            buffers.forEach(function (buffer) {
                buffer.push(' ');
            });
        }
        return buffers;
    }());

    __current__.sort(function (a, b) {
        return b.start - a.start;
    });

    __current__.forEach(function (tok, index) {
        for(var j = tok.start; j < tok.end; j += 1) {
            buffers[0].splice(j, 1, '^');
        }
        var val = String(tok.value);
        buffers[1].splice(tok.start, 1, '|');
        buffers[2].splice(tok.start, val.length, val);
        //buffers[2].splice(tok.start, (tok.end - tok.start), '*');
    });

    q.tap.note(line);
    q.tap.note(buffers[0].join(''));
    q.tap.note(buffers[1].join(''));
    q.tap.note(buffers[2].join(''));
    //q.tap.note(q.tap.explain(__current__));
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
});
