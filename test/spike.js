var q = require('qunitjs'),
    passert = require('../lib/power-assert'),
    util = require('util'),
    fs = require('fs'),
    path = require('path');

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
    //assert.ok((look('hoge', hoge) === look('fuga', fuga)));
    //assert.ok(look('hoge', hoge) === look('fuga', fuga));
    //passert('/Users/takuto/work/git-sandbox/private/power-assert.js/test/spike.js:19:12');

    function look(name, ident) {
        return ident;
    }

    var content, syntax, tokens;
    content = fs.readFileSync('/Users/takuto/work/git-sandbox/private/power-assert.js/test/spike.js', 'utf-8');
    passert(content);
});
