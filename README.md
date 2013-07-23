power-assert - Empower your assertions
================================


DESCRIPTION
---------------------------------------
`power-assert` is an implementation of "Power Assert" in JavaScript, powered by [Esprima](http://esprima.org/) and [Escodegen](https://github.com/Constellation/escodegen).

`power-assert` is a standard `assert` compatible library.

Please note that power-assert is an alpha version product, so backward compatibility breaking changes will be occurred very often. Pull-requests, issue reports and patches are always welcome.


HOW TO USE
---------------------------------------

First, install power-assert via `npm`.

    $ npm install -g power-assert

Second, generate empowered code using `empower` command.

    $ empower your_test.js > your_test_empowered.js

Then run your test in your way.

    $ node your_test_empowered.js


OUTPUT EXAMPLE
---------------------------------------

### Target test code (using Mocha in this example)


    var assert = require('power-assert');
    
    describe('Array', function(){
        beforeEach(function(){
            this.ary = [1,2,3];
        });
        describe('#indexOf()', function(){
            it('should return -1 when the value is not present', function(){
                var zero = 0, two = 2;
                assert(this.ary.indexOf(zero) === two);
            });
            it('should return index when the value is present', function(){
                var minusOne = -1, two = 2;
                assert.ok(this.ary.indexOf(two) === minusOne, 'THIS IS AN ASSERTION MESSAGE');
            });
        });
    });


### `empower` code above then run


      $ mocha /path/to/examples/mocha_node_empowered.js
    
      ․․
    
      0 passing (5 ms)
      2 failing
    
      1) Array #indexOf() should return -1 when the value is not present:
         AssertionError: # /path/to/examples/mocha_node.js:10
    
                assert(this.ary.indexOf(zero) === two);
                            |   |       |     |   |
                            |   |       |     |   2
                            |   -1      0     false
                            [1,2,3]
    
          at powerAssert (/path/to/node_modules/power-assert/lib/power-assert.js:32:17)
          at Context.<anonymous> (/path/to/examples/mocha_node_empowered.js:13:13)
          at Test.Runnable.run (/path/to/node_modules/mocha/lib/runnable.js:211:32)
          at Runner.runTest (/path/to/node_modules/mocha/lib/runner.js:355:10)
          at /path/to/node_modules/mocha/lib/runner.js:401:12
          at next (/path/to/node_modules/mocha/lib/runner.js:281:14)
          at /path/to/node_modules/mocha/lib/runner.js:290:7
          at next (/path/to/node_modules/mocha/lib/runner.js:234:23)
          at Object._onImmediate (/path/to/node_modules/mocha/lib/runner.js:258:5)
          at processImmediate [as _immediateCallback] (timers.js:309:15)
    
      2) Array #indexOf() should return index when the value is present:
         AssertionError: THIS IS AN ASSERTION MESSAGE # /path/to/examples/mocha_node.js:14
    
                assert.ok(this.ary.indexOf(two) === minusOne, 'THIS IS AN ASSERTION MESSAGE');
                               |   |       |    |   |
                               |   |       |    |   -1
                               |   1       2    false
                               [1,2,3]
    
          at Context.<anonymous> (/path/to/examples/mocha_node_empowered.js:48:20)
          at Test.Runnable.run (/path/to/node_modules/mocha/lib/runnable.js:211:32)
          at Runner.runTest (/path/to/node_modules/mocha/lib/runner.js:355:10)
          at /path/to/node_modules/mocha/lib/runner.js:401:12
          at next (/path/to/node_modules/mocha/lib/runner.js:281:14)
          at /path/to/node_modules/mocha/lib/runner.js:290:7
          at next (/path/to/node_modules/mocha/lib/runner.js:234:23)
          at Object._onImmediate (/path/to/node_modules/mocha/lib/runner.js:258:5)
          at processImmediate [as _immediateCallback] (timers.js:309:15)




TESTED FRAMEWORKS
---------------------------------------
* [Mocha](http://visionmedia.github.io/mocha/)
* [QUnit](http://qunitjs.com/)


TESTED ENVIRONMENTS
---------------------------------------
* [Node.js](http://nodejs.org/)
* [Rhino](https://developer.mozilla.org/en/Rhino)
* [PhantomJS](http://phantomjs.org/)


AUTHOR
---------------------------------------
* [Takuto Wada](http://github.com/twada)


LICENSE
---------------------------------------
Licensed under the [MIT](https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt) license.



MORE OUTPUT EXAMPLES
---------------------------------------

### Target test code (using QUnit in this example)

    var q = require('power-assert').empowerQUnit(require('qunitjs')),
        tap = (function (qu) {
            var qunitTap = require("qunit-tap").qunitTap,
                util = require('util'),
                tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
            qu.init();
            qu.config.updateRate = 0;
            return tap;
        })(q);
    
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
    
        var actual = 16;
        assert.ok(5 < actual && actual < 13);
    
        actual = 4;
        assert.ok(5 < actual && actual < 13);
    
        actual = 10;
        assert.ok(actual < 5 || 13 < actual);
    
    
        var foo = {
            bar: {
                baz: false
            }
        };
        assert.ok(foo.bar.baz);
    
    
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



### `empower` code above then running under Node.js
    
    # test: spike
    ok 1
    not ok 2 - comment # /path/to/examples/qunit_node.js:16
    #
    #     assert.ok(hoge === fuga, 'comment');
    #               |    |   |
    #               |    |   "bar"
    #               |    false
    #               "foo"
    # , test: spike
    not ok 3 - # /path/to/examples/qunit_node.js:19
    #
    #     assert.ok(fuga === piyo);
    #               |    |   |
    #               |    |   3
    #               |    false
    #               "bar"
    # , test: spike
    not ok 4 - # /path/to/examples/qunit_node.js:23
    #
    #     assert.ok(longString === anotherLongString);
    #               |          |   |
    #               |          |   "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
    #               |          false
    #               "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
    # , test: spike
    not ok 5 - # /path/to/examples/qunit_node.js:25
    #
    #     assert.ok(4 === piyo);
    #                 |   |
    #                 |   3
    #                 false
    # , test: spike
    not ok 6 - # /path/to/examples/qunit_node.js:27
    #
    #     assert.ok(4 !== 4);
    #                 |
    #                 false
    # , test: spike
    not ok 7 - # /path/to/examples/qunit_node.js:30
    #
    #     assert.ok(falsyStr);
    #               |
    #               ""
    # , test: spike
    not ok 8 - # /path/to/examples/qunit_node.js:33
    #
    #     assert.ok(falsyNum);
    #               |
    #               0
    # , test: spike
    not ok 9 - # /path/to/examples/qunit_node.js:37
    #
    #     assert.ok(ary1.length === ary2.length);
    #               |    |      |   |    |
    #               |    |      |   |    3
    #               |    |      |   ["aaa","bbb","ccc"]
    #               |    2      false
    #               ["foo","bar"]
    # , test: spike
    not ok 10 - # /path/to/examples/qunit_node.js:40
    #
    #     assert.ok(5 < actual && actual < 13);
    #                 | |         |      |
    #                 | 16        16     false
    #                 true
    # , test: spike
    not ok 11 - # /path/to/examples/qunit_node.js:43
    #
    #     assert.ok(5 < actual && actual < 13);
    #                 | |
    #                 | 4
    #                 false
    # , test: spike
    not ok 12 - # /path/to/examples/qunit_node.js:46
    #
    #     assert.ok(actual < 5 || 13 < actual);
    #               |      |         | |
    #               |      |         | 10
    #               10     false     false
    # , test: spike
    not ok 13 - # /path/to/examples/qunit_node.js:54
    #
    #     assert.ok(foo.bar.baz);
    #               |   |   |
    #               |   |   false
    #               |   {"baz":false}
    #               {"bar":{"baz":false}}
    # , test: spike
    not ok 14 - # /path/to/examples/qunit_node.js:58
    #
    #     assert.ok(!truth);
    #                |
    #                true
    # , test: spike
    not ok 15 - # /path/to/examples/qunit_node.js:62
    #
    #     assert.ok(func());
    #               |
    #               false
    # , test: spike
    not ok 16 - # /path/to/examples/qunit_node.js:70
    #
    #     assert.ok(obj.age());
    #               |   |
    #               {}  0
    # , test: spike
    not ok 17 - # /path/to/examples/qunit_node.js:77
    #
    #     assert.ok(isFalsy(positiveInt));
    #               |       |
    #               false   50
    # , test: spike
    not ok 18 - # /path/to/examples/qunit_node.js:88
    #
    #     assert.ok(sum(one, two, three) === seven);
    #               |   |    |    |      |   |
    #               |   |    |    |      |   7
    #               6   1    2    3      false
    # , test: spike
    not ok 19 - # /path/to/examples/qunit_node.js:89
    #
    #     assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven));
    #               |   |   |    |     |      |   |   |   |    |       |
    #               |   |   |    |     |      |   12  5   2    3       7
    #               6   3   1    2     3      false
    # , test: spike
    not ok 20 - # /path/to/examples/qunit_node.js:90
    #
    #     assert.ok((three * (seven * ten)) === three);
    #                |     |  |     | |     |   |
    #                |     |  |     | |     |   3
    #                |     |  |     | 10    false
    #                |     |  7     70
    #                3     210
    # , test: spike
    not ok 21 - # /path/to/examples/qunit_node.js:104
    #
    #     assert.ok(math.calc.sum(one, two, three) === seven);
    #               |    |    |   |    |    |      |   |
    #               |    |    |   |    |    |      |   7
    #               |    {}   6   1    2    3      false
    #               {"calc":{}}
    # , test: spike
    1..21


Have fun!
