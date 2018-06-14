if (typeof window === 'undefined') {
    var expect = require('expect.js');
    var assert = require('../..');
}

describe('power-assert on ES20xx syntax', function () {
    'use strict';

    function expectPowerAssertMessage (body, expectedLines) {
        try {
            body();
            expect().fail("AssertionError should be thrown");
        } catch (e) {
            expect(e.message.split('\n').slice(2, -1)).to.eql(expectedLines);
        }
    }

    describe('ES2015', () => {
        it('Destructuring and TemplateLiteral', () => {
            let [alice, bob] = [ { name: 'alice' }, { name: 'bob' } ];
            expectPowerAssertMessage (() => {
                assert(`${alice.name} and ${bob.name}` === `bob and alice`);
            }, [
                '  assert(`${alice.name} and ${bob.name}` === `bob and alice`)',
                '         |  |     |           |   |      |   |               ',
                '         |  |     |           |   |      |   "bob and alice" ',
                '         |  |     |           |   "bob"  false               ',
                '         |  |     "alice"     Object{name:"bob"}             ',
                '         |  Object{name:"alice"}                             ',
                '         "alice and bob"                                     ',
                '  ',
                '  --- [string] `bob and alice`',
                '  +++ [string] `${alice.name} and ${bob.name}`',
                '  @@ -1,13 +1,13 @@',
                '  -bob and alice',
                '  +alice and bob',
                '  '
            ]);
        });

        it('ArrowFunctionExpression and SpreadElement', () => {
            let seven = 7, ary = [4, 5];
            expectPowerAssertMessage (() => {
                assert(seven === ((v, i) => v + i)(...[...ary]));
            }, [
                '  assert(seven === ((v, i) => v + i)(...[...ary]))',
                '         |     |   |                    |   |     ',
                '         |     |   |                    |   [4,5] ',
                '         |     |   9                    [4,5]     ',
                '         7     false                              ',
                '  ',
                '  [number] ((v, i) => v + i)(...[...ary])',
                '  => 9',
                '  [number] seven',
                '  => 7'
            ]);
        });

        it('Enhanced Object Literals', () => {
            let name = 'bobby';
            expectPowerAssertMessage (() => {
                assert.deepEqual({
                    name,
                    [`${ name } greet`]: `Hello, I am ${ name }`
                }, null);
            }, [
                '  assert.deepEqual({ name, [`${name} greet`]: `Hello, I am ${name}` }, null)',
                '                   |        |  |              |              |              ',
                '                   |        |  |              |              "bobby"        ',
                '                   |        |  "bobby"        "Hello, I am bobby"           ',
                '                   |        "bobby greet"                                   ',
                '                   Object{name:"bobby","bobby greet":"Hello, I am bobby"}   '
            ]);
        });
    });

    describe('ES2018', () => {
        it('Object Rest/Spread', () => {
            expectPowerAssertMessage (() => {
                var o = { a: 1, b: 2 };
                assert.deepStrictEqual({ ...o, c: 5 }, { a: 1, b: 2, c: 3 });
            }, [
                '  assert.deepStrictEqual({ ...o, c: 5 }, { a: 1, b: 2, c: 3 })',
                '                         |               |                    ',
                '                         |               Object{a:1,b:2,c:3}  ',
                '                         Object{a:1,b:2,c:5}                  '
            ]);
        });
    });

});
