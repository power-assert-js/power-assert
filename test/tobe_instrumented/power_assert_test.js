(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['power-assert', 'expect'], factory);
    } else if (typeof exports === 'object') {
        factory(require('../..'), require('expect.js'));
    } else {
        factory(root.assert, root.expect);
    }
}(this, function (assert, expect) {

describe('power-assert message', function () {
    beforeEach(function () {
        this.expectPowerAssertMessage = function (body, expectedLines) {
            try {
                body();
                expect().fail("AssertionError should be thrown");
            } catch (e) {
                if (typeof e.message === 'undefined') { // Node 0.8.x workaround
                    expect(e.actual).to.not.be.ok();
                    expect(e.expected).to.be.ok();
                } else {
                    expect(e.message.split('\n').slice(2, -1)).to.eql(expectedLines.map(function (line) {
                        return line;
                    }));
                }
            }
        };
    });


    it('assert(false);', function () {
        this.expectPowerAssertMessage(function () {
            assert(false);
        }, [
        ]);
    });


    it('Identifier with empty string', function () {
        var falsyStr = '';
        this.expectPowerAssertMessage(function () {
            assert(falsyStr);
        },[
            '  assert(falsyStr)',
            '         |        ',
            '         ""       '
        ]);
    });


    it('Identifier with falsy number', function () {
        var falsyNum = 0;
        this.expectPowerAssertMessage(function () {
            assert(falsyNum);
        }, [
            '  assert(falsyNum)',
            '         |        ',
            '         0        '
        ]);
    });


    it('UnaryExpression, negation', function () {
        var truth = true;
        this.expectPowerAssertMessage(function () {
            assert(!truth);
        }, [
            '  assert(!truth)',
            '         ||     ',
            '         |true  ',
            '         false  '
        ]);
    });


    it('UnaryExpression, double negative', function () {
        var some = '';
        this.expectPowerAssertMessage(function () {
            assert(!!some);
        }, [
            '  assert(!!some)',
            '         |||    ',
            '         ||""   ',
            '         |true  ',
            '         false  '
        ]);
    });


    it('typeof operator: assert(typeof foo !== "undefined");', function () {
        this.expectPowerAssertMessage(function () {
            assert(typeof foo !== "undefined");
        }, [
            '  assert(typeof foo !== "undefined")',
            '         |          |               ',
            '         |          false           ',
            '         "undefined"                '
        ]);
    });


    it('assert((delete nonexistent) === false);', function () {
        this.expectPowerAssertMessage(function () {
            assert((delete nonexistent) === false);
        }, [
            '  assert(delete nonexistent === false)',
            '         |                  |         ',
            '         true               false     ',
            '  ',
            '  [boolean] false',
            '  => false',
            '  [boolean] delete nonexistent',
            '  => true'
        ]);
    });


    it('assert((delete foo.bar) === falsy);', function () {
        var falsy = 0,
            foo = {
                bar: {
                    baz: false
                }
            };
        this.expectPowerAssertMessage(function () {
            assert((delete foo.bar) === falsy);
        }, [
            '  assert(delete foo.bar === falsy)',
            '         |      |   |   |   |     ',
            '         |      |   |   |   0     ',
            '         |      |   |   false     ',
            '         |      |   Object{baz:false}',
            '         true   Object{bar:#Object#}',
            '  ',
            '  [number] falsy',
            '  => 0',
            '  [boolean] delete foo.bar',
            '  => true'
        ]);
    });


    it('assert(fuga === piyo);', function () {
        var fuga = 'foo',
            piyo = 8;
        this.expectPowerAssertMessage(function () {
            assert(fuga === piyo);
        }, [
            '  assert(fuga === piyo)',
            '         |    |   |    ',
            '         |    |   8    ',
            '         |    false    ',
            '         "foo"         ',
            '  ',
            '  [number] piyo',
            '  => 8',
            '  [string] fuga',
            '  => "foo"'
        ]);
    });


    it('assert(fuga !== piyo);', function () {
        var fuga = 'foo',
            piyo = 'foo';
        this.expectPowerAssertMessage(function () {
            assert(fuga !== piyo);
        }, [
            '  assert(fuga !== piyo)',
            '         |    |   |    ',
            '         |    |   "foo"',
            '         |    false    ',
            '         "foo"         '
        ]);
    });


    it('BinaryExpression with Literal and Identifier: assert(fuga !== 4);', function () {
        var fuga = 4;
        this.expectPowerAssertMessage(function () {
            assert(fuga !== 4);
        }, [
            '  assert(fuga !== 4)',
            '         |    |     ',
            '         4    false '
        ]);
    });


    it('assert(4 !== 4);', function () {
        this.expectPowerAssertMessage(function () {
            assert(4 !== 4);
        }, [
            '  assert(4 !== 4)',
            '           |     ',
            '           false '
        ]);
    });


    it('MemberExpression: assert(ary1.length === ary2.length);', function () {
        var ary1 = ['foo', 'bar'];
        var ary2 = ['aaa', 'bbb', 'ccc'];
        this.expectPowerAssertMessage(function () {
            assert(ary1.length === ary2.length);
        }, [
            '  assert(ary1.length === ary2.length)',
            '         |    |      |   |    |      ',
            '         |    |      |   |    3      ',
            '         |    |      |   ["aaa","bbb","ccc"]',
            '         |    2      false           ',
            '         ["foo","bar"]               ',
            '  ',
            '  [number] ary2.length',
            '  => 3',
            '  [number] ary1.length',
            '  => 2'
        ]);
    });


    it('LogicalExpression: assert(5 < actual && actual < 13);', function () {
        var actual = 16;
        this.expectPowerAssertMessage(function () {
            assert(5 < actual && actual < 13);
        }, [
            '  assert(5 < actual && actual < 13)',
            '           | |      |  |      |    ',
            '           | |      |  16     false',
            '           | 16     false          ',
            '           true                    '
        ]);
    });


    it('LogicalExpression OR: assert.ok(actual < 5 || 13 < actual);', function () {
        var actual = 10;
        this.expectPowerAssertMessage(function () {
            assert.ok(actual < 5 || 13 < actual);
        }, [
            '  assert.ok(actual < 5 || 13 < actual)',
            '            |      |   |     | |      ',
            '            |      |   |     | 10     ',
            '            |      |   false false    ',
            '            10     false              '
        ]);
    });


    it('Characterization test of LogicalExpression current spec: assert(2 > actual && actual < 13);', function () {
        var actual = 5;
        this.expectPowerAssertMessage(function () {
            assert(2 > actual && actual < 13);
        }, [
            '  assert(2 > actual && actual < 13)',
            '           | |      |              ',
            '           | 5      false          ',
            '           false                   '
        ]);
    });


    it('Deep MemberExpression chain: assert(foo.bar.baz);', function () {
        var foo = {
            bar: {
                baz: false
            }
        };
        this.expectPowerAssertMessage(function () {
            assert(foo.bar.baz);
        }, [
            '  assert(foo.bar.baz)',
            '         |   |   |   ',
            '         |   |   false',
            '         |   Object{baz:false}',
            '         Object{bar:#Object#}'
        ]);
    });


    it('computed MemberExpression: assert(foo["bar"]);', function () {
        var foo = {
            bar: false
        };
        this.expectPowerAssertMessage(function () {
            assert(foo["bar"]);
        }, [
            '  assert(foo["bar"])',
            '         |  |       ',
            '         |  false   ',
            '         Object{bar:false}'
        ]);
    });


    it('computed MemberExpression chain: assert(foo[key].baz);', function () {
        var key = 'bar',
            foo = {
                bar: {
                    baz: false
                }
            };
        this.expectPowerAssertMessage(function () {
            assert(foo[key].baz);
        }, [
            '  assert(foo[key].baz)',
            '         |  ||    |   ',
            '         |  ||    false',
            '         |  |"bar"    ',
            '         |  Object{baz:false}',
            '         Object{bar:#Object#}'
        ]);
    });


    it('deep chained computed MemberExpression: assert(foo[propName]["baz"][keys()[0]]);', function () {
        var keys = function () { return ["toto"]; },
            propName = "bar",
            foo = {
                bar: {
                    baz: {
                        toto: false
                    }
                }
            };
        this.expectPowerAssertMessage(function () {
            assert(foo[propName]["baz"][keys()[0]]);
        }, [
            '  assert(foo[propName]["baz"][keys()[0]])',
            '         |  ||        |      ||     |    ',
            '         |  ||        |      ||     "toto"',
            '         |  ||        |      |["toto"]   ',
            '         |  ||        |      false       ',
            '         |  |"bar"    Object{toto:false} ',
            '         |  Object{baz:#Object#}         ',
            '         Object{bar:#Object#}            '
        ]);
    });


    it('deep chained computed MemberExpression with whitespaces: assert(  foo [   propName   ]  [  "baz"   ]  [   keys ( )  [ 0 ] ] );', function () {
        var keys = function () { return ["toto"]; },
            propName = "bar",
            foo = {
                bar: {
                    baz: {
                        toto: false
                    }
                }
            };
        this.expectPowerAssertMessage(function () {
            assert(  foo [   propName   ]  [  "baz"   ]  [   keys ( )  [ 0 ] ] );
        }, [
            '  assert(foo[propName]["baz"][keys()[0]])',
            '         |  ||        |      ||     |    ',
            '         |  ||        |      ||     "toto"',
            '         |  ||        |      |["toto"]   ',
            '         |  ||        |      false       ',
            '         |  |"bar"    Object{toto:false} ',
            '         |  Object{baz:#Object#}         ',
            '         Object{bar:#Object#}            '
        ]);
    });


    it('assert(func());', function () {
        var func = function () { return false; };
        this.expectPowerAssertMessage(function () {
            assert(func());
        }, [
            '  assert(func())',
            '         |      ',
            '         false  '
        ]);
    });


    it('assert(obj.age());', function () {
        var obj = {
            age: function () {
                return 0;
            }
        };
        this.expectPowerAssertMessage(function () {
            assert(obj.age());
        }, [
            '  assert(obj.age())',
            '         |   |     ',
            '         |   0     ',
            '         Object{age:#function#}'
        ]);
    });


    it('CallExpression with arguments: assert(isFalsy(positiveInt));', function () {
        var isFalsy = function (arg) {
            return !(arg);
        };
        var positiveInt = 50;
        this.expectPowerAssertMessage(function () {
            assert(isFalsy(positiveInt));
        }, [
            '  assert(isFalsy(positiveInt))',
            '         |       |            ',
            '         false   50           '
        ]);
    });


    it('assert(sum(one, two, three) === seven);', function () {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectPowerAssertMessage(function () {
            assert(sum(one, two, three) === seven);
        }, [
            '  assert(sum(one, two, three) === seven)',
            '         |   |    |    |      |   |     ',
            '         |   |    |    |      |   7     ',
            '         6   1    2    3      false     ',
            '  ',
            '  [number] seven',
            '  => 7',
            '  [number] sum(one, two, three)',
            '  => 6'
        ]);
    });


    it('CallExpression with CallExpressions as arguments: assert(sum(sum(one, two), three) === sum(sum(two, three), seven));', function () {
        var sum = function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        };
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectPowerAssertMessage(function () {
            assert(sum(sum(one, two), three) === sum(sum(two, three), seven));
        }, [
            '  assert(sum(sum(one, two), three) === sum(sum(two, three), seven))',
            '         |   |   |    |     |      |   |   |   |    |       |      ',
            '         |   |   |    |     |      |   12  5   2    3       7      ',
            '         6   3   1    2     3      false                           ',
            '  ',
            '  [number] sum(sum(two, three), seven)',
            '  => 12',
            '  [number] sum(sum(one, two), three)',
            '  => 6'
        ]);
    });


    it('assert(math.calc.sum(one, two, three) === seven);', function () {
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
        this.expectPowerAssertMessage(function () {
            assert(math.calc.sum(one, two, three) === seven);
        }, [
            '  assert(math.calc.sum(one, two, three) === seven)',
            '         |    |    |   |    |    |      |   |     ',
            '         |    |    |   |    |    |      |   7     ',
            '         |    |    6   1    2    3      false     ',
            '         |    Object{sum:#function#}              ',
            '         Object{calc:#Object#}                    ',
            '  ',
            '  [number] seven',
            '  => 7',
            '  [number] math.calc.sum(one, two, three)',
            '  => 6'
        ]);
    });


    it('Nested CallExpression with BinaryExpression: assert((three * (seven * ten)) === three);', function () {
        var one = 1, two = 2, three = 3, seven = 7, ten = 10;
        this.expectPowerAssertMessage(function () {
            assert((three * (seven * ten)) === three);
        }, [
            '  assert(three * (seven * ten) === three)',
            '         |     |  |     | |    |   |     ',
            '         |     |  |     | |    |   3     ',
            '         |     |  |     | 10   false     ',
            '         |     |  7     70               ',
            '         3     210                       ',
            '  ',
            '  [number] three',
            '  => 3',
            '  [number] three * (seven * ten)',
            '  => 210'
        ]);
    });


    it('Simple BinaryExpression with comment', function () {
        var hoge = 'foo';
        var fuga = 'bar';
        this.expectPowerAssertMessage(function () {
            assert.ok(hoge === fuga, "comment");
        }, [
            '  assert.ok(hoge === fuga, "comment")',
            '            |    |   |               ',
            '            |    |   "bar"           ',
            '            |    false               ',
            '            "foo"                    ',
            '  ',
            '  --- [string] fuga',
            '  +++ [string] hoge',
            '  @@ -1,3 +1,3 @@',
            '  -bar',
            '  +foo',
            '  '
        ]);
    });


    it('Looooong string', function () {
        var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
        this.expectPowerAssertMessage(function () {
            assert(longString === anotherLongString);
        }, [
            '  assert(longString === anotherLongString)',
            '         |          |   |                 ',
            '         |          |   "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
            '         |          false                 ',
            '         "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"',
            '  ',
            '  --- [string] anotherLongString',
            '  +++ [string] longString',
            '  @@ -1,15 +1,13 @@',
            '  -yet anoth',
            '  +very v',
            '   er',
            '  +y',
            '    loo',
            '  '
        ]);
    });


    it('double byte character width', function () {
        var fuga = 'あい',
            piyo = 'うえお';
        var concat = function (a, b) {
            return a + b;
        };
        this.expectPowerAssertMessage(function () {
            assert(!concat(fuga, piyo));
        }, [
            '  assert(!concat(fuga, piyo))',
            '         ||      |     |     ',
            '         ||      |     "うえお"',
            '         ||      "あい"      ',
            '         |"あいうえお"       ',
            '         false               '
        ]);
    });


    it('Japanese hankaku width', function () {
        var fuga = 'ｱｲ',
            piyo = 'ｳｴｵ';
        var concat = function (a, b) {
            return a + b;
        };
        this.expectPowerAssertMessage(function () {
            assert(!concat(fuga, piyo));
        }, [
            '  assert(!concat(fuga, piyo))',
            '         ||      |     |     ',
            '         ||      "ｱｲ"  "ｳｴｵ" ',
            '         |"ｱｲｳｴｵ"            ',
            '         false               '
        ]);
    });


    it('Object having circular structure', function () {
        var cyclic = [], two = 2;
        cyclic.push('foo');
        cyclic.push(cyclic);
        cyclic.push('baz');
        this.expectPowerAssertMessage(function () {
            assert.ok(cyclic[two] === cyclic);
        }, [
            '  assert.ok(cyclic[two] === cyclic)',
            '            |     ||    |   |      ',
            '            |     ||    |   ["foo",#@Circular#,"baz"]',
            '            |     |2    false      ',
            '            |     "baz"            ',
            '            ["foo",#@Circular#,"baz"]',
            '  ',
            '  [Array] cyclic',
            '  => ["foo",#@Circular#,"baz"]',
            '  [string] cyclic[two]',
            '  => "baz"'
        ]);
    });



    it('ArrayExpression: assert([foo, bar].length === four);', function () {
        var foo = 'hoge', bar = 'fuga', four = 4;
        this.expectPowerAssertMessage(function () {
            assert([foo, bar].length === four);
        }, [
            '  assert([foo,bar].length === four)',
            '          |   |    |      |   |    ',
            '          |   |    |      |   4    ',
            '          |   |    2      false    ',
            '          |   "fuga"               ',
            '          "hoge"                   ',
            '  ',
            '  [number] four',
            '  => 4',
            '  [number] [foo,bar].length',
            '  => 2'
        ]);
    });



    it('various expressions in ArrayExpression: assert(typeof [[foo.bar, baz(moo)], + fourStr] === "number");', function () {
        var foo = {bar: 'fuga'}, baz = function (arg) { return null; }, moo = 'boo', fourStr = '4';
        this.expectPowerAssertMessage(function () {
            assert(typeof [[foo.bar, baz(moo)], + fourStr] === "number");
        }, [
            '  assert(typeof [[foo.bar,baz(moo)],+fourStr] === "number")',
            '         |        |   |   |   |     ||        |            ',
            '         |        |   |   |   |     |"4"      false        ',
            '         |        |   |   |   "boo" 4                      ',
            '         |        |   |   null                             ',
            '         |        |   "fuga"                               ',
            '         "object" Object{bar:"fuga"}                       ',
            '  ',
            '  --- [string] "number"',
            '  +++ [string] typeof [[foo.bar,baz(moo)],+fourStr]',
            '  @@ -1,6 +1,6 @@',
            '  -number',
            '  +object',
            '  '
        ]);
    });


    it('prefix UpdateExpression: assert(++minusOne);', function () {
        var minusOne = -1;
        this.expectPowerAssertMessage(function () {
            assert(++minusOne);
        }, [
            '  assert(++minusOne)',
            '         |          ',
            '         0          '
        ]);
    });


    it('suffix UpdateExpression: assert(zero--);', function () {
        var zero = 0;
        this.expectPowerAssertMessage(function () {
            assert(zero--);
        }, [
            '  assert(zero--)',
            '         |      ',
            '         0      '
        ]);
    });


    it('ConditionalExpression of ConditionalExpression: assert(falsy ? truthy : truthy ? anotherFalsy : truthy);', function () {
        var truthy = 'truthy', falsy = 0, anotherFalsy = null;
        this.expectPowerAssertMessage(function () {
            assert(falsy ? truthy : truthy ? anotherFalsy : truthy);
        }, [
            '  assert(falsy ? truthy : truthy ? anotherFalsy : truthy)',
            '         |                |        |                     ',
            '         0                "truthy" null                  '
        ]);
    });


    it('RegularExpression will not be instrumented: assert(/^not/.exec(str));', function () {
        var str = 'ok';
        this.expectPowerAssertMessage(function () {
            assert(/^not/.exec(str));
        }, [
            '  assert(/^not/.exec(str))',
            '                |    |    ',
            '                null "ok" '
        ]);
    });


    it('complex ObjectExpression: assert(!({ foo: bar.baz, name: nameOf({firstName: first, lastName: last}) }));', function () {
        var bar = { baz: 'BAZ' },  first = 'Brendan', last = 'Eich',
            nameOf = function (person) { return person.firstName + ' ' + person.lastName; };
        this.expectPowerAssertMessage(function () {
            assert(!({ foo: bar.baz, name: nameOf({firstName: first, lastName: last}) }));
        }, [
            '  assert(!{foo: bar.baz,name: nameOf({firstName: first,lastName: last})})',
            '         |      |   |         |                  |               |       ',
            '         |      |   "BAZ"     "Brendan Eich"     "Brendan"       "Eich"  ',
            '         false  Object{baz:"BAZ"}                                        '
        ]);
    });


    it('NewExpression: assert(baz === new Array(foo, bar, baz)[1]);', function () {
        var foo = 'foo', bar = 'bar', baz = 'baz';
        this.expectPowerAssertMessage(function () {
            assert(baz === new Array(foo, bar, baz)[1]);
        }, [
            '  assert(baz === new Array(foo, bar, baz)[1])',
            '         |   |   |         |    |    |   |   ',
            '         |   |   |         |    |    |   "bar"',
            '         |   |   |         |    |    "baz"   ',
            '         |   |   |         |    "bar"        ',
            '         |   |   |         "foo"             ',
            '         |   |   ["foo","bar","baz"]         ',
            '         |   false                           ',
            '         "baz"                               ',
            '  ',
            '  --- [string] new Array(foo, bar, baz)[1]',
            '  +++ [string] baz',
            '  @@ -1,3 +1,3 @@',
            '   ba',
            '  -r',
            '  +z',
            '  '
        ]);
    });


    it('FunctionExpression will not be instrumented: assert(baz === (function (a, b) { return a + b; })(foo, bar));', function () {
        var foo = 'foo', bar = 'bar', baz = 'baz';
        this.expectPowerAssertMessage(function () {
            assert(baz === (function (a, b) { return a + b; })(foo, bar));
        }, [
            '  assert(baz === function (a, b) {return a + b;}(foo, bar))',
            '         |   |   |                               |    |    ',
            '         |   |   |                               |    "bar"',
            '         |   |   "foobar"                        "foo"     ',
            '         |   false                                         ',
            '         "baz"                                             ',
            '  ',
            '  --- [string] function (a, b) {return a + b;}(foo, bar)',
            '  +++ [string] baz',
            '  @@ -1,6 +1,3 @@',
            '  -foo',
            '   ba',
            '  -r',
            '  +z',
            '  '
        ]);
    });


    it('equal with Literal and Identifier: assert.equal(1, minusOne);', function () {
        var minusOne = -1;
        this.expectPowerAssertMessage(function () {
            assert.equal(1, minusOne);
        },[
            '  assert.equal(1, minusOne)',
            '                  |        ',
            '                  -1       '
        ]);
    });


    it('equal with UpdateExpression and Literal: assert.equal(++minusOne, 1);', function () {
        var minusOne = -1;
        this.expectPowerAssertMessage(function () {
            assert.equal(++minusOne, 1);
        },[
            '  assert.equal(++minusOne, 1)',
            '               |             ',
            '               0             '
        ]);
    });


    it('notEqual with ConditionalExpression and AssignmentExpression: assert.notEqual(truthy ? fiveInStr : tenInStr, four += 1);', function () {
        var truthy = 3, fiveInStr = '5', tenInStr = '10', four = 4;
        this.expectPowerAssertMessage(function () {
            assert.notEqual(truthy ? fiveInStr : tenInStr, four += 1);
        },[
            '  assert.notEqual(truthy ? fiveInStr : tenInStr, four += 1)',
            '                  |        |                          |    ',
            '                  3        "5"                        5    '
        ]);
    });


    it('strictEqual with CallExpression and BinaryExpression, Identifier: assert.strictEqual(obj.truthy(), three == threeInStr);', function () {
        var obj = { truthy: function () { return 'true'; }}, three = 3, threeInStr = '3';
        this.expectPowerAssertMessage(function () {
            assert.strictEqual(obj.truthy(), three == threeInStr);
        },[
            '  assert.strictEqual(obj.truthy(), three == threeInStr)',
            '                     |   |         |     |  |          ',
            '                     |   |         |     |  "3"        ',
            '                     |   "true"    3     true          ',
            '                     Object{truthy:#function#}         '
        ]);
    });


    it('notStrictEqual with MemberExpression and UnaryExpression: assert.notStrictEqual(typeof undefinedVar, types.undef);', function () {
        var types = { undef: 'undefined' };
        this.expectPowerAssertMessage(function () {
            assert.notStrictEqual(typeof undefinedVar, types.undef);
        },[
            '  assert.notStrictEqual(typeof undefinedVar, types.undef)',
            '                        |                    |     |     ',
            '                        |                    |     "undefined"',
            '                        "undefined"          Object{undef:"undefined"}'
        ]);
    });


    it('deepEqual with LogicalExpression and ObjectExpression: assert.deepEqual(alice || bob, {name: kenName, age: four});', function () {
        function Person(name, age) {
            this.name = name;
            this.age = age;
        }
        var alice = new Person('alice', 3),
            bob = new Person('bob', 5),
            kenName = 'ken', four = 4;
        this.expectPowerAssertMessage(function () {
            assert.deepEqual(alice || bob, {name: kenName, age: four});
        },[
            '  assert.deepEqual(alice || bob, {name: kenName,age: four})',
            '                   |     |              |            |     ',
            '                   |     |              "ken"        4     ',
            '                   |     Person{name:"alice",age:3}        ',
            '                   Person{name:"alice",age:3}              '
        ]);
    });


    it('notDeepEqual with ArrayExpression and NewExpression: assert.notDeepEqual([foo, bar, baz], new Array(foo, bar, baz));', function () {
        var foo = 'foo', bar = ['toto', 'tata'], baz = {name: 'hoge'};
        this.expectPowerAssertMessage(function () {
            assert.notDeepEqual([foo, bar, baz], new Array(foo, bar, baz));
        },[
            '  assert.notDeepEqual([foo,bar,baz], new Array(foo, bar, baz))',
            '                       |   |   |     |         |    |    |    ',
            '                       |   |   |     |         |    |    Object{name:"hoge"}',
            '                       |   |   |     |         |    ["toto","tata"]',
            '                       |   |   |     |         "foo"          ',
            '                       |   |   |     ["foo",#Array#,#Object#] ',
            '                       |   |   Object{name:"hoge"}            ',
            '                       |   ["toto","tata"]                    ',
            '                       "foo"                                  '
        ]);
    });

});

}));
