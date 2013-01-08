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
    if (!result) {
        //q.tap.note('failed: ' + line);
        q.tap.note(line);
        var str = '';
        for(var i = 0; i < line.length; i += 1) {
            str += line.charAt(i);
        }
        // line.length
        q.tap.note(q.tap.explain(__current__));
    }
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
