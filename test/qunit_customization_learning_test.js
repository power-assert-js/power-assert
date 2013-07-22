var q = require('qunitjs'),
    tap = (function (qu) {
        var qunitTap = require("qunit-tap").qunitTap,
            util = require('util'),
            tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
        qu.init();
        qu.config.updateRate = 0;
        return tap;
    })(q);

(function (qunit) {
    var notOk = function (value, message) {
        qunit.push( !value, undefined, undefined, message );
    };
    qunit.assert['notOk'] = notOk;
    qunit['notOk'] = notOk;
})(q);


q.test('add notOk function', function (assert) {
    assert.notOk(false);
    q.notOk(null);
});

q.test('test in test', function (assert) {
    q.test('nested', function (assert) {
        assert.notOk(false, 'foo');
        q.notOk(null, 'bar');
    });

    assert.notOk(false, 'baz');
});
