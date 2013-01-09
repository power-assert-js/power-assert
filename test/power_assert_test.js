var _pa_ = require('../lib/power-assert'),
    q = require('qunitjs'),
    util = require('util'),
    orig = _pa_.puts;

(function (qu) {
    var qunitTap = require("qunit-tap").qunitTap;
    qunitTap(qu, util.puts, {noPlan: true, showSourceOnFailure: false});
    qu.init();
    qu.config.updateRate = 0;
})(q);


q.module('reporter', {
    setup: function () {
        var that = this;
        that.lines = [];
        _pa_.puts = function (str) {
            that.lines.push(str);
        };
    },
    teardown: function () {
        _pa_.puts = orig;
    }
});


q.test('simple', function (assert) {
    var fuga = 'bar';
    var piyo = 3;
    _pa_.expr(_pa_.ident('fuga', fuga, 14, 18) === _pa_.ident('piyo', piyo, 23, 27), '    assert.ok(fuga === piyo);');
    assert.equal(this.lines.length, 6);
    assert.equal(this.lines[0], "");
    assert.equal(this.lines[1], "    assert.ok(fuga === piyo);");
    assert.equal(this.lines[2], "              ^^^^     ^^^^  ");
    assert.equal(this.lines[3], "              |        |     ");
    assert.equal(this.lines[4], "              |        3     ");
    assert.equal(this.lines[5], "              \"bar\"          ");
});


q.test('with comment', function (assert) {
    var hoge = 'foo';
    var fuga = 'bar';
    _pa_.expr(_pa_.ident('hoge', hoge, 14, 18) === _pa_.ident('fuga', fuga, 23, 27), '    assert.ok(hoge === fuga, \'comment\');');
    assert.equal(this.lines.length, 6);
    assert.equal(this.lines[0], "");
    assert.equal(this.lines[1], "    assert.ok(hoge === fuga, \'comment\');");
    assert.equal(this.lines[2], "              ^^^^     ^^^^             ");
    assert.equal(this.lines[3], "              |        |                ");
    assert.equal(this.lines[4], "              |        \"bar\"            ");
    assert.equal(this.lines[5], "              \"foo\"                     ");
});
