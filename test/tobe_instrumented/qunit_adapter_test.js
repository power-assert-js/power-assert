var empower = require('empower'),
    formatter = require('power-assert-formatter')(),
    q = require('qunitjs'),
    qunitTap = require("qunit-tap"),
    qunitAssertions = [],
    output = [],
    puts = function (str) {
        output.push(str);
    },
    expect = require('expect.js');


(function (qu) {
    qu.config.autorun = false;
    qu.config.updateRate = 0;
    if (qu.config.semaphore !== 1) {
        qu.config.semaphore = 1;
    }
    qunitTap(qu, puts, {
        showModuleNameOnFailure: false,
        showTestNameOnFailure: false,
        showExpectationOnFailure: true,
        showSourceOnFailure: false
    });
    empower(qu.assert, formatter, {destructive: true});
})(q);


function doQUnitTest (testName, testBody, expectedLines) {
    q.test(testName, function (assert) {
        output.length = 0;
        testBody(assert);
        qunitAssertions.push({
            name: testName,
            expected: expectedLines,
            actual: output[0].split('\n').slice(2)
        });
    });
}



it('QUnit output', function (mochaDone) {

    q.done(function () {
        var expectedResults = [],
            actualResults = [];
        try {
            qunitAssertions.forEach(function (test) {
                expectedResults.push({
                    testName: test.name,
                    output: test.expected
                });
                actualResults.push({
                    testName: test.name,
                    output: test.actual
                });
            });
            expect(actualResults).to.eql(expectedResults);
            mochaDone();
        } catch (e) {
            mochaDone(e);
        }
    });



    doQUnitTest('Identifier with empty string', function (assert) {
        var falsyStr = '';
        assert.ok(falsyStr);
    }, [
        '#   assert.ok(falsyStr)',
        '#             |        ',
        '#             ""       ',
        '#   '
    ]);


    doQUnitTest('Identifier with falsy number', function (assert) {
        var falsyNum = 0;
        assert.ok(falsyNum);
    }, [
        '#   assert.ok(falsyNum)',
        '#             |        ',
        '#             0        ',
        '#   '
    ]);


    doQUnitTest('UnaryExpression, negation', function (assert) {
        var truth = true;
        assert.ok(!truth);
    }, [
        '#   assert.ok(!truth)',
        '#             ||     ',
        '#             |true  ',
        '#             false  ',
        '#   '
    ]);


    doQUnitTest('UnaryExpression, double negative', function (assert) {
        var some = '';
        assert.ok(!!some);
    }, [
        '#   assert.ok(!!some)',
        '#             |||    ',
        '#             ||""   ',
        '#             |true  ',
        '#             false  ',
        '#   '
    ]);


    doQUnitTest('typeof operator: assert.ok(typeof foo !== "undefined");', function (assert) {
        assert.ok(typeof foo !== "undefined");
    }, [
        '#   assert.ok(typeof foo !== "undefined")',
        '#             |          |               ',
        '#             |          false           ',
        '#             "undefined"                ',
        '#   '
    ]);


    doQUnitTest('assert.ok(delete foo.bar);', function (assert) {
        var falsy = 0,
            foo = {
                bar: {
                    baz: false
                }
            };
        assert.ok((delete foo.bar) === falsy);
    }, [
        '#   assert.ok(delete foo.bar === falsy)',
        '#             |      |   |   |   |     ',
        '#             |      |   |   |   0     ',
        '#             |      |   |   false     ',
        '#             |      |   Object{baz:false}',
        '#             true   Object{bar:#Object#}',
        '#   ',
        '#   [number] falsy',
        '#   => 0',
        '#   [boolean] delete foo.bar',
        '#   => true',
        '#   '
    ]);


    doQUnitTest('assert.ok(fuga === piyo);', function (assert) {
        var fuga = 'foo',
            piyo = 8;
        assert.ok(fuga === piyo);
    }, [
        '#   assert.ok(fuga === piyo)',
        '#             |    |   |    ',
        '#             |    |   8    ',
        '#             |    false    ',
        '#             "foo"         ',
        '#   ',
        '#   [number] piyo',
        '#   => 8',
        '#   [string] fuga',
        '#   => "foo"',
        '#   '
    ]);



    doQUnitTest('assert.ok(fuga !== piyo);', function (assert) {
        var fuga = 'foo',
            piyo = 'foo';
        assert.ok(fuga !== piyo);
    }, [
        '#   assert.ok(fuga !== piyo)',
        '#             |    |   |    ',
        '#             |    |   "foo"',
        '#             |    false    ',
        '#             "foo"         ',
        '#   '
    ]);



    doQUnitTest('BinaryExpression with Literal and Identifier: assert.ok(fuga !== 4);', function (assert) {
        var fuga = 4;
        assert.ok(fuga !== 4);
    }, [
        '#   assert.ok(fuga !== 4)',
        '#             |    |     ',
        '#             4    false ',
        '#   '
    ]);



    doQUnitTest('assert.ok(4 !== 4);', function (assert) {
        assert.ok(4 !== 4);
    }, [
        '#   assert.ok(4 !== 4)',
        '#               |     ',
        '#               false ',
        '#   '
    ]);



    doQUnitTest('MemberExpression: assert.ok(ary1.length === ary2.length);', function (assert) {
        var ary1 = ['foo', 'bar'];
        var ary2 = ['aaa', 'bbb', 'ccc'];
        assert.ok(ary1.length === ary2.length);
    }, [
        '#   assert.ok(ary1.length === ary2.length)',
        '#             |    |      |   |    |      ',
        '#             |    |      |   |    3      ',
        '#             |    |      |   ["aaa","bbb","ccc"]',
        '#             |    2      false           ',
        '#             ["foo","bar"]               ',
        '#   ',
        '#   [number] ary2.length',
        '#   => 3',
        '#   [number] ary1.length',
        '#   => 2',
        '#   '
    ]);



    doQUnitTest('LogicalExpression: assert.ok(5 < actual && actual < 13);', function (assert) {
        var actual = 16;
        assert.ok(5 < actual && actual < 13);
    }, [
        '#   assert.ok(5 < actual && actual < 13)',
        '#               | |      |  |      |    ',
        '#               | |      |  16     false',
        '#               | 16     false          ',
        '#               true                    ',
        '#   '
    ]);



    doQUnitTest('LogicalExpression OR: assert.ok(actual < 5 || 13 < actual);', function (assert) {
        var actual = 10;
        assert.ok(actual < 5 || 13 < actual);
    }, [
        '#   assert.ok(actual < 5 || 13 < actual)',
        '#             |      |   |     | |      ',
        '#             |      |   |     | 10     ',
        '#             |      |   false false    ',
        '#             10     false              ',
        '#   '
    ]);



    doQUnitTest('Characterization test of LogicalExpression current spec: assert.ok(2 > actual && actual < 13);', function (assert) {
        var actual = 5;
        assert.ok(2 > actual && actual < 13);
    }, [
        '#   assert.ok(2 > actual && actual < 13)',
        '#               | |      |              ',
        '#               | 5      false          ',
        '#               false                   ',
        '#   '
    ]);



    doQUnitTest('Deep MemberExpression chain: assert.ok(foo.bar.baz);', function (assert) {
        var foo = {
            bar: {
                baz: false
            }
        };
        assert.ok(foo.bar.baz);
    }, [
        '#   assert.ok(foo.bar.baz)',
        '#             |   |   |   ',
        '#             |   |   false',
        '#             |   Object{baz:false}',
        '#             Object{bar:#Object#}',
        '#   '
    ]);



    doQUnitTest('assert.ok(func());', function (assert) {
        var func = function () { return false; };
        assert.ok(func());
    }, [
        '#   assert.ok(func())',
        '#             |      ',
        '#             false  ',
        '#   '
    ]);



    doQUnitTest('assert.ok(obj.age());', function (assert) {
        var obj = {
            age: function () {
                return 0;
            }
        };
        assert.ok(obj.age());
    }, [
        '#   assert.ok(obj.age())',
        '#             |   |     ',
        '#             |   0     ',
        '#             Object{age:#function#}',
        '#   '
    ]);



    doQUnitTest('CallExpression with arguments: assert.ok(isFalsy(positiveInt));', function (assert) {
        var isFalsy = function (arg) {
            return !(arg);
        };
        var positiveInt = 50;
        assert.ok(isFalsy(positiveInt));
    }, [
        '#   assert.ok(isFalsy(positiveInt))',
        '#             |       |            ',
        '#             false   50           ',
        '#   '
    ]);



    doQUnitTest('assert.ok(sum(one, two, three) === seven);', function (assert) {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        assert.ok(sum(one, two, three) === seven);
    }, [
        '#   assert.ok(sum(one, two, three) === seven)',
        '#             |   |    |    |      |   |     ',
        '#             |   |    |    |      |   7     ',
        '#             6   1    2    3      false     ',
        '#   ',
        '#   [number] seven',
        '#   => 7',
        '#   [number] sum(one, two, three)',
        '#   => 6',
        '#   '
    ]);



    doQUnitTest('CallExpression with CallExpressions as arguments: assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven));', function (assert) {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven));
    }, [
        '#   assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven))',
        '#             |   |   |    |     |      |   |   |   |    |       |      ',
        '#             |   |   |    |     |      |   12  5   2    3       7      ',
        '#             6   3   1    2     3      false                           ',
        '#   ',
        '#   [number] sum(sum(two, three), seven)',
        '#   => 12',
        '#   [number] sum(sum(one, two), three)',
        '#   => 6',
        '#   '
    ]);



    doQUnitTest('assert.ok(math.calc.sum(one, two, three) === seven);', function (assert) {
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
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        assert.ok(math.calc.sum(one, two, three) === seven);
    }, [
        '#   assert.ok(math.calc.sum(one, two, three) === seven)',
        '#             |    |    |   |    |    |      |   |     ',
        '#             |    |    |   |    |    |      |   7     ',
        '#             |    |    6   1    2    3      false     ',
        '#             |    Object{sum:#function#}              ',
        '#             Object{calc:#Object#}                    ',
        '#   ',
        '#   [number] seven',
        '#   => 7',
        '#   [number] math.calc.sum(one, two, three)',
        '#   => 6',
        '#   '
    ]);



    doQUnitTest('Nested CallExpression with BinaryExpression: assert.ok((three * (seven * ten)) === three);', function (assert) {
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        assert.ok((three * (seven * ten)) === three);
    }, [
        '#   assert.ok(three * (seven * ten) === three)',
        '#             |     |  |     | |    |   |     ',
        '#             |     |  |     | |    |   3     ',
        '#             |     |  |     | 10   false     ',
        '#             |     |  7     70               ',
        '#             3     210                       ',
        '#   ',
        '#   [number] three',
        '#   => 3',
        '#   [number] three * (seven * ten)',
        '#   => 210',
        '#   '
    ]);



    doQUnitTest('Simple BinaryExpression with comment', function (assert) {
        var hoge = 'foo';
        var fuga = 'bar';
        assert.ok(hoge === fuga, "comment");
    }, [
        '#   assert.ok(hoge === fuga, "comment")',
        '#             |    |   |               ',
        '#             |    |   "bar"           ',
        '#             |    false               ',
        '#             "foo"                    ',
        '#   ',
        '#   --- [string] fuga',
        '#   +++ [string] hoge',
        '#   @@ -1,3 +1,3 @@',
        '#   -bar',
        '#   +foo',
        '#   ',
        '#   '
    ]);



    doQUnitTest('Looooong string', function (assert) {
        var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        assert.ok(longString === anotherLongString);
    }, [
        '#   assert.ok(longString === anotherLongString)',
        '#             |          |   |                 ',
        '#             |          |   "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
        '#             |          false                 ',
        '#             "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
        '#   ',
        '#   --- [string] anotherLongString',
        '#   +++ [string] longString',
        '#   @@ -1,15 +1,13 @@',
        '#   -yet anoth',
        '#   +very v',
        '#    er',
        '#   +y',
        '#     loo',
        '#   ',
        '#   '
    ]);



    doQUnitTest('double byte character width', function (assert) {
        var fuga = 'あい',
            piyo = 'うえお';
        var concat = function (a, b) {
            return a + b;
        };
        assert.ok(!concat(fuga, piyo));
    }, [
        '#   assert.ok(!concat(fuga, piyo))',
        '#             ||      |     |     ',
        '#             ||      |     "うえお"',
        '#             ||      "あい"      ',
        '#             |"あいうえお"       ',
        '#             false               ',
        '#   '
    ]);



    doQUnitTest('Japanese hankaku width', function (assert) {
        var fuga = 'ｱｲ',
            piyo = 'ｳｴｵ';
        var concat = function (a, b) {
            return a + b;
        };
        assert.ok(!concat(fuga, piyo));
    }, [
        '#   assert.ok(!concat(fuga, piyo))',
        '#             ||      |     |     ',
        '#             ||      "ｱｲ"  "ｳｴｵ" ',
        '#             |"ｱｲｳｴｵ"            ',
        '#             false               ',
        '#   '
    ]);





    doQUnitTest('equal with Literal and Identifier: assert.equal(1, minusOne);', function (assert) {
        var minusOne = -1;
        assert.equal(1, minusOne);
    },[
        '#   assert.equal(1, minusOne)',
        '#                   |        ',
        '#                   -1       ',
        '#   , expected: -1, got: 1'
    ]);


    doQUnitTest('equal with UpdateExpression and Literal: assert.equal(++minusOne, 1);', function (assert) {
        var minusOne = -1;
        assert.equal(++minusOne, 1);
    },[
        '#   assert.equal(++minusOne, 1)',
        '#                |             ',
        '#                0             ',
        '#   , expected: 1, got: 0'
    ]);


    doQUnitTest('notEqual with ConditionalExpression and AssignmentExpression: assert.notEqual(truthy ? fiveInStr : tenInStr, four += 1);', function (assert) {
        var truthy = 3, fiveInStr = '5', tenInStr = '10', four = 4;
        assert.notEqual(truthy ? fiveInStr : tenInStr, four += 1);
    },[
        '#   assert.notEqual(truthy ? fiveInStr : tenInStr, four += 1)',
        '#                   |        |                          |    ',
        '#                   3        "5"                        5    ',
        '#   , expected: 5, got: "5"'
    ]);


    doQUnitTest('strictEqual with CallExpression and BinaryExpression, Identifier: assert.strictEqual(obj.truthy(), three == threeInStr);', function (assert) {
        var obj = { truthy: function () { return 'true'; }}, three = 3, threeInStr = '3';
        assert.strictEqual(obj.truthy(), three == threeInStr);
    },[
        '#   assert.strictEqual(obj.truthy(), three == threeInStr)',
        '#                      |   |         |     |  |          ',
        '#                      |   |         |     |  "3"        ',
        '#                      |   "true"    3     true          ',
        '#                      Object{truthy:#function#}         ',
        '#   , expected: true, got: "true"'
    ]);


    doQUnitTest('notStrictEqual with MemberExpression and UnaryExpression: assert.notStrictEqual(typeof undefinedVar, types.undef);', function (assert) {
        var types = { undef: 'undefined' };
        assert.notStrictEqual(typeof undefinedVar, types.undef);
    },[
        '#   assert.notStrictEqual(typeof undefinedVar, types.undef)',
        '#                         |                    |     |     ',
        '#                         |                    |     "undefined"',
        '#                         "undefined"          Object{undef:"undefined"}',
        '#   , expected: "undefined", got: "undefined"'
    ]);


    doQUnitTest('deepEqual with LogicalExpression and ObjectExpression: assert.deepEqual(alice || bob, {name: kenName, age: four});', function (assert) {
        function Person(name, age) {
            this.name = name;
            this.age = age;
        }
        var alice = new Person('alice', 3),
            bob = new Person('bob', 5),
            kenName = 'ken', four = 4;
        assert.deepEqual(alice || bob, {name: kenName, age: four});
    },[
        '#   assert.deepEqual(alice || bob, {name: kenName,age: four})',
        '#                    |     |              |            |     ',
        '#                    |     |              "ken"        4     ',
        '#                    |     Person{name:"alice",age:3}        ',
        '#                    Person{name:"alice",age:3}              ',
        '#   , expected: {',
        '#   "age": 4,',
        '#   "name": "ken"',
        '# }, got: {',
        '#   "age": 3,',
        '#   "name": "alice"',
        '# }'
    ]);


    doQUnitTest('notDeepEqual with ArrayExpression and NewExpression: assert.notDeepEqual([foo, bar, baz], new Array(foo, bar, baz));', function (assert) {
        var foo = 'foo', bar = ['toto', 'tata'], baz = {name: 'hoge'};
        assert.notDeepEqual([foo, bar, baz], new Array(foo, bar, baz));
    },[
        '#   assert.notDeepEqual([foo,bar,baz], new Array(foo, bar, baz))',
        '#                        |   |   |     |         |    |    |    ',
        '#                        |   |   |     |         |    |    Object{name:"hoge"}',
        '#                        |   |   |     |         |    ["toto","tata"]',
        '#                        |   |   |     |         "foo"          ',
        '#                        |   |   |     ["foo",#Array#,#Object#] ',
        '#                        |   |   Object{name:"hoge"}            ',
        '#                        |   ["toto","tata"]                    ',
        '#                        "foo"                                  ',
        '#   , expected: [',
        '#   "foo",',
        '#   [',
        '#     "toto",',
        '#     "tata"',
        '#   ],',
        '#   {',
        '#     "name": "hoge"',
        '#   }',
        '# ], got: [',
        '#   "foo",',
        '#   [',
        '#     "toto",',
        '#     "tata"',
        '#   ],',
        '#   {',
        '#     "name": "hoge"',
        '#   }',
        '# ]'
    ]);


    q.load();
});
