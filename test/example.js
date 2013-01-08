var q = require('qunitjs'),
    util = require('util');

var __current__ = {};
var __save__ = function (name, value, loc) {
    __current__[name] = {
        name: name,
        value: value,
        loc: loc
    };
    return value;
};

(function (qunitObject) {
    var qunitTap = require("qunit-tap").qunitTap;
    qunitTap(qunitObject, util.puts, {noPlan: true, showSourceOnFailure: true});
    qunitObject.init();
    qunitObject.config.updateRate = 0;
    var tap = qunitObject.tap;

	// log: { result, actual, expected, message }
    qunitObject.log(function (details) {
        if(!(details.result)) {
            tap.note(tap.explain(__current__));
        }
        __current__ = {};
    });
})(q);

q.test('spike', function (assert) {
    var hoge = 'foo';
    var fuga = 'bar';
    assert.ok(hoge === fuga, 'comment');
});
