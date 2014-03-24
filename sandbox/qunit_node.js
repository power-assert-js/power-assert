var q = require('qunitjs');

(function () {
    var empower = require('empower'),
        formatter = require('power-assert-formatter'),
        qunitTap = require("qunit-tap");
    empower(q.assert, formatter(), {destructive: true});
    qunitTap(q, require('util').puts, {showSourceOnFailure: false});
    q.config.autorun = false;
})();

q.test('spike', function (assert) {
    assert.ok(true);

    var hoge = 'foo';
    var fuga = 'bar';
    assert.ok(hoge === fuga, 'comment');

    var piyo = 3;
    assert.ok(fuga === piyo);

    var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    assert.ok(longString === anotherLongString);

    assert.ok(4 === piyo);

    assert.ok(4 !== 4);

    var falsyStr = '';
    assert.ok(falsyStr);

    var falsyNum = 0;
    assert.ok(falsyNum);

    var ary1 = ['foo', 'bar'];
    var ary2 = ['aaa', 'bbb', 'ccc'];
    assert.ok(ary1.length === ary2.length);
    assert.deepEqual(ary1, ary2);

    var actual = 16;
    assert.ok(5 < actual && actual < 13);

    actual = 4;
    assert.ok(5 < actual && actual < 13);

    actual = 10;
    assert.ok(actual < 5 || 13 < actual);


    var propName = 'bar',
        foo = {
            bar: {
                baz: false
            }
        };

    assert.ok(foo.bar.baz);
    assert.ok(foo['bar'].baz);
    assert.ok(foo[propName]['baz']);


    var truth = true;
    assert.ok(!truth);


    var func = function () { return false; };
    assert.ok(func());


    var obj = {
        age: function () {
            return 0;
        }
    };
    assert.ok(obj.age());


    var isFalsy = function (arg) {
        return !(arg);
    };
    var positiveInt = 50;
    assert.ok(isFalsy(positiveInt));


    var sum = function () {
        var result = 0;
        for (var i = 0; i < arguments.length; i += 1) {
            result += arguments[i];
        }
        return result;
    };
    var one = 1, two = 2, three = 3, seven = 7, ten = 10;
    assert.ok(sum(one, two, three) === seven);
    assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven));
    assert.ok((three * (seven * ten)) === three);


    var math = {
        calc: {
            sum: function () {
                var result = 0;
                for (var i = 0; i < arguments.length; i += 1) {
                    result += arguments[i];
                }
                return result;
            }
        }
    };
    assert.ok(math.calc.sum(one, two, three) === seven);
});

q.load();
