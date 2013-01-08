var q = require('qunitjs'),
    util = require('util');

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
