power-assert
================================

Power Assert in JavaScript. Provides descriptive assertion messages through standard [assert](http://nodejs.org/api/assert.html) interface.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]


DESCRIPTION
---------------------------------------

What is `power-assert`?

 * is an implementation of "Power Assert" concept in JavaScript.
 * provides descriptive assertion messages through standard [assert](http://nodejs.org/api/assert.html) interface.
 * see slides: ["power-assert, mechanism and philosophy"](http://www.slideshare.net/t_wada/power-assert-nodefest-2014) -- talk at NodeFest 2014.
 * to use power-assert, you need to transform your test code to show power-assert output.
 * with power-assert, you don't need to learn many assertion library APIs. It's just [assert](http://nodejs.org/api/assert.html).
 * fully compatible with [assert](http://nodejs.org/api/assert.html). So you can stop using power-assert and back to assert easily.
 * has [online demo site](http://azu.github.io/power-assert-demo/).
 * works both on server side and browser side.
 * available via [npm](https://www.npmjs.com/package/power-assert) and [bower](http://bower.io/search/?q=power-assert). 
 * supports sourcemaps so you can debug as usual.
 * provides [browserify transform](http://github.com/twada/espowerify).
 * provides [grunt task](http://github.com/twada/grunt-espower) and [gulp plugin](http://github.com/twada/gulp-espower).
 * provides [command](http://github.com/twada/espower-cli).
 * provides [custom module loader](http://github.com/twada/espower-loader) and its [convenient config module](https://github.com/azu/intelli-espower-loader).
 * provides [karma preprocessor](https://github.com/vvakame/karma-espower-preprocessor).
 * supports ES6 through [Traceur Compiler](https://github.com/yosuke-furukawa/espower-traceur) or [6to5](https://github.com/azu/espower-6to5).
 * supports [CoffeeScript](http://github.com/twada/espower-coffee).
 * has [TypeScript type definition](https://github.com/borisyankov/DefinitelyTyped/blob/master/power-assert/power-assert.d.ts)
 * is a beta version product. Pull-requests, issue reports and patches are always welcomed.


`power-assert` provides descriptive assertion messages for your tests, like this.

      1) Array #indexOf() should return index when the value is present:
         AssertionError: # /path/to/test/mocha_node.js:10
    
      assert(this.ary.indexOf(zero) === two)
                  |   |       |     |   |
                  |   |       |     |   2
                  |   -1      0     false
                  [1,2,3]
    
      [number] two
      => 2
      [number] this.ary.indexOf(zero)
      => -1


API
---------------------------------------

power-assert enhances these assert functions. Produces descriptive message when assertion is failed.

* `assert(value, [message])`
* `assert.ok(value, [message])`
* `assert.equal(actual, expected, [message])`
* `assert.notEqual(actual, expected, [message])`
* `assert.strictEqual(actual, expected, [message])`
* `assert.notStrictEqual(actual, expected, [message])`
* `assert.deepEqual(actual, expected, [message])`
* `assert.notDeepEqual(actual, expected, [message])`

power-assert is fully compatible with [assert](http://nodejs.org/api/assert.html). So functions below are also available though they are not enhanced (does not produce descriptive message).

* `assert.fail(actual, expected, message, operator)`
* `assert.throws(block, [error], [message])`
* `assert.doesNotThrow(block, [message])`
* `assert.ifError(value)`

power-assert provides an [API for customization](https://github.com/twada/power-assert#customization-api).

* `assert.customize(options)`

As written below, power-assert is constructed with many family modules. See more details of [empower](http://github.com/twada/empower) and others.


CHANGELOG
---------------------------------------
See [CHANGELOG](https://github.com/twada/power-assert/blob/master/CHANGELOG.md)


EXAMPLE
---------------------------------------

See [HOW TO USE](https://github.com/twada/power-assert#how-to-use) section for more details.

__Note:__ There is an [online demo site](http://azu.github.io/power-assert-demo/) available.


### Target test code (using Mocha in this example)

```javascript
var assert = require('power-assert');

describe('Array', function(){
    beforeEach(function(){
        this.ary = [1,2,3];
    });
    describe('#indexOf()', function(){
        it('should return index when the value is present', function(){
            var zero = 0, two = 2;
            assert(this.ary.indexOf(zero) === two);
        });
        it('should return -1 when the value is not present', function(){
            var minusOne = -1, two = 2;
            assert.ok(this.ary.indexOf(two) === minusOne, 'THIS IS AN ASSERTION MESSAGE');
        });
    });
});

describe('various types', function(){
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    beforeEach(function(){
        this.types = [
            'string', 98.6, true, false, null, undefined,
            ['nested', 'array'],
            {object: true},
            NaN, Infinity,
            /^not/,
            new Person('alice', 3)
        ];
    });
    it('demo', function(){
        var index = this.types.length -1,
            bob = new Person('bob', 5);
        assert(this.types[index].name === bob.name);
    });
});
```

### Be sure to transform test code

To use power-assert, you need to transform your test code for power-assert output.

Code transform is done by instrumentors below:

 - [espower-loader](http://github.com/twada/espower-loader) (with [intelli-espower-loader](https://github.com/azu/intelli-espower-loader))
 - [espower-cli](http://github.com/twada/espower-cli)
 - [espowerify](http://github.com/twada/espowerify)
 - [grunt-espower](http://github.com/twada/grunt-espower)
 - [gulp-espower](http://github.com/twada/gulp-espower)
 - [karma-espower-preprocessor](https://github.com/vvakame/karma-espower-preprocessor)
 - [espower-coffee](http://github.com/twada/espower-coffee)
 - [espower-traceur](https://github.com/yosuke-furukawa/espower-traceur)
 - [espower-6to5](https://github.com/azu/espower-6to5)

If you are using Node.js only, the easiest way is to use [intelli-espower-loader](https://github.com/azu/intelli-espower-loader). Steps are as follows.


### Setup

`npm install --save-dev mocha power-assert intelli-espower-loader`

### Add directories to package.json

```json
  "directories": {
    "test": "test/"
  },
```

### See the power-assert output appears.

      $ mocha --require intelli-espower-loader /path/to/test/mocha_node.js
    
      Array
        #indexOf()
          1) should return index when the value is present
          2) should return -1 when the value is not present
      
      various types
        3) demo    
    
      0 passing (14 ms)
      3 failing
    
      1) Array #indexOf() should return index when the value is present:
         AssertionError: # /path/to/test/mocha_node.js:10
      
        assert(this.ary.indexOf(zero) === two)
                    |   |       |     |   |
                    |   |       |     |   2
                    |   -1      0     false
                    [1,2,3]
        
        [number] two
        => 2
        [number] this.ary.indexOf(zero)
        => -1

          at decoratedAssert (/path/to/node_modules/power-assert/node_modules/empower/lib/decorate.js:44:26)
          at powerAssert (/path/to/node_modules/power-assert/node_modules/empower/index.js:57:32)
          at Context.<anonymous> (/path/to/test/mocha_node.js:13:13)
      
      
      2) Array #indexOf() should return -1 when the value is not present:
         AssertionError: THIS IS AN ASSERTION MESSAGE # /path/to/test/mocha_node.js:14
    
        assert.ok(this.ary.indexOf(two) === minusOne, 'THIS IS AN ASSERTION MESSAGE')
                       |   |       |    |   |
                       |   |       |    |   -1
                       |   1       2    false
                       [1,2,3]
        
        [number] minusOne
        => -1
        [number] this.ary.indexOf(two)
        => 1
      
          at Function.decoratedAssert [as ok] (/path/to/node_modules/power-assert/node_modules/empower/lib/decorate.js:44:26)
          at Context.<anonymous> (/path/to/test/mocha_node.js:21:20)
      
      
      3) various types demo:
         AssertionError: # /path/to/test/mocha_node.js:37
    
        assert(this.types[index].name === bob.name)
                    |    ||      |    |   |   |
                    |    ||      |    |   |   "bob"
                    |    ||      |    |   Person{name:"bob",age:5}
                    |    ||      |    false
                    |    |11     "alice"
                    |    Person{name:"alice",age:3}
                    ["string",98.6,true,false,null,undefined,#Array#,#Object#,NaN,Infinity,/^not/,#Person#]
        
        --- [string] bob.name
        +++ [string] this.types[index].name
        @@ -1,3 +1,5 @@
        -bob
        +alice
        
        
          at decoratedAssert (/path/to/node_modules/power-assert/node_modules/empower/lib/decorate.js:44:26)
          at powerAssert (/path/to/node_modules/power-assert/node_modules/empower/index.js:57:32)
          at Context.<anonymous> (/path/to/test/mocha_node.js:55:9)


SEED PROJECTS
---------------------------------------

Some seed projects are available to help you start with power-assert.

| module | env | tech stack |
|:-------|:------------|:------------|
| [power-assert-node-seed](https://github.com/azu/power-assert-node-seed) | Node.js | power-assert + [intelli-espower-loader](https://github.com/azu/intelli-espower-loader) |
| [power-assert-testem-seed](https://github.com/azu/power-assert-testem-seed) | Browsers(by [testem](https://github.com/airportyh/testem)) | power-assert + [gulp-espower](http://github.com/twada/gulp-espower) + [testem](https://github.com/airportyh/testem). |
| [power-assert-karma-seed](https://github.com/azu/power-assert-karma-seed) | Browsers(by [Karma](http://karma-runner.github.io/)) | power-assert + [espowerify](http://github.com/twada/espowerify) + [browserify](http://browserify.org/) + [Karma](http://karma-runner.github.io/). |


HOW TO USE
---------------------------------------

There are four ways to use power-assert. (If you want to see running examples, see [SEED PROJECTS](#seed-projects))

1. `power-assert` + `espower-loader`: Highly recommended but only works under Node.
2. `power-assert` + `espower-coffee` or `espower-traceur` or `espower-6to5` : Use power-assert through transpilers. Recommended but only works under Node.
3. `power-assert` + `espowerify` : Recommended if you are using [browserify](http://browserify.org/).
4. `power-assert` + `espower-cli` or `grunt-espower` or `gulp-espower` : Generate instrumented code so works anywhere.


### using `espower-loader`

If you are writing Node.js app/module, you can instrument Power Assert feature without code generation by using `espower-loader`.

First, install `power-assert` and `espower-loader` via npm.

    $ npm install --save-dev power-assert espower-loader

Second, require `power-assert` in your test.

    --- a/test/your_test.js
    +++ b/test/your_test.js
    @@ -1,4 +1,4 @@
    -var assert = require('assert');
    +var assert = require('power-assert');


Third, put `enable-power-assert.js` somewhere in your project, where `pattern` matches to target test files.

```javascript
require('espower-loader')({
    // directory where match starts with
    cwd: process.cwd(),
    // glob pattern using minimatch module
    pattern: 'test/**/*.js'
});
```

Then run mocha, with `--require` option. No code generation required.

    $ mocha --require ./path/to/enable-power-assert test/your_test.js


FYI: You may be interested in [intelli-espower-loader](https://github.com/azu/intelli-espower-loader) to go one step further. With [intelli-espower-loader](https://github.com/azu/intelli-espower-loader), you don't need to create loader file (like `enable-power-assert.js`). Just define test directory in `package.json` wow!


### using `espower-coffee`

If you are writing Node.js app/module in CoffeeScript, you can instrument Power Assert feature without code generation by using `espower-coffee`.

see [espower-coffee README](https://github.com/twada/espower-coffee).


### using `espower-traceur` or `espower-6to5`

If you are writing Node.js app/module in ES6, you can instrument Power Assert feature without code generation by using `espower-traceur` or `espower-6to5`. `espower-traceur` uses [Traceur Compiler](https://github.com/google/traceur-compiler/), `espower-6to5` uses [6to5](https://6to5.org/).

see [espower-traceur README](https://github.com/yosuke-furukawa/espower-traceur) or [espower-6to5 README](https://github.com/azu/espower-6to5).


### using `espowerify`

On the browser side and you are using [browserify](http://browserify.org/), you can instrument Power Assert feature via `espowerify`.

First, install `power-assert` and `espowerify` via npm.

    $ npm install --save-dev power-assert espowerify

Second, require `power-assert` in your test.

    --- a/test/your_test.js
    +++ b/test/your_test.js
    @@ -1,4 +1,4 @@
    -var assert = require('assert');
    +var assert = require('power-assert');

Third, apply `espowerify` through browserify transform.

    $ browserify -t espowerify test/your_test.js > dist/your_test.js

Lastly, run your test in your way. For example,

    $ mocha-phantomjs path/to/test.html



### using `espower-cli`

On the browser side and you don't want to use grunt,gulp or browserify, you can use `power-assert` via bower, with generated code by `espower-cli`

First, install `power-assert` via bower and `espower-cli` via npm. This means that you run `espower` command (on Node), then run tests on browser.

    $ bower install --save-dev power-assert
    $ npm install --save-dev gulp-espower

Second, require `build/power-assert.js` (all-in-one build for browsers) in your test html.

    <script type="text/javascript" src="./path/to/bower_components/power-assert/build/power-assert.js"></script>

Then, generate espowered code.

    $ espower test/your_test.js > powered/your_test.js

Lastly, run your test in your way. For example,

    $ mocha-phantomjs path/to/test.html



### using `grunt-espower`

On the browser side and you are not using [browserify](http://browserify.org/) but [bower](http://bower.io/) and [Grunt](http://gruntjs.com/), you can use `power-assert` via bower, with generated code by `grunt-espower`

First, install `power-assert` via bower and `grunt-espower` via npm. This means that you run grunt (on Node), then run tests on browser.

    $ bower install --save-dev power-assert
    $ npm install --save-dev grunt-espower

Second, require `build/power-assert.js` (all-in-one build for browsers) in your test html.

    <script type="text/javascript" src="./path/to/bower_components/power-assert/build/power-assert.js"></script>

Third, configure `grunt-espower` task to  generate espowered code.

```javascript
grunt.initConfig({

  . . . 

  espower: {
    test: {
      files: [
        {
          expand: true,        // Enable dynamic expansion.
          cwd: 'test/',        // Src matches are relative to this path.
          src: ['**/*.js'],    // Actual pattern(s) to match.
          dest: 'espowered/',  // Destination path prefix.
          ext: '.js'           // Dest filepaths will have this extension.
        }
      ]
    },
  },

  . . . 

})
```

Then, generate espowered code using `espower` task.

    $ grunt espower:test

Lastly, run your test in your way. For example,

    $ grunt test




### using `gulp-espower`

On the browser side and you are not using [browserify](http://browserify.org/) but [bower](http://bower.io/) and [gulp](http://gulpjs.com/), you can use `power-assert` via bower, with generated code by `gulp-espower`

First, install `power-assert` via bower and `gulp-espower` via npm. This means that you run gulp (on Node), then run tests on browser.

    $ bower install --save-dev power-assert
    $ npm install --save-dev gulp-espower

Second, require `build/power-assert.js` (all-in-one build for browsers) in your test html.

    <script type="text/javascript" src="./path/to/bower_components/power-assert/build/power-assert.js"></script>

Third, configure `gulp-espower` task to generate espowered code.

```javascript
var gulp = require('gulp'),
    espower = require('gulp-espower');
  . . . 
gulp.task('espower', function() {
    return gulp
        .src('test/**/*_test.js', {base: './test/'})
        .pipe(espower())
        .pipe(gulp.dest('espowered'));
});
  . . . 
})
```

Then, generate espowered code (in this example, using `espower` task).

    $ gulp espower

Lastly, run your test in your way. For example,

    $ gulp test




CUSTOMIZATION API
---------------------------------------

`power-assert` provides an API for customization.

### var assert = assert.customize(options)

Through this API, you can customize power-assert by changing some options.

```javascript
var assert = require('power-assert').customize({
    output: {
        maxDepth: 2
    }
});
```

### options

`options` has two top-level keys. `assertion` and `output`.

#### options.assertion

customization options for [empower](http://github.com/twada/empower) module. See [empower API documentation](https://github.com/twada/empower#api) for details. Note that some default values are different from `empower`'s (`modifyMessageOnRethrow: true` and `saveContextOnRethrow: true`).

#### options.output

customization options for [power-assert-formatter](http://github.com/twada/power-assert-formatter) module. See [power-assert-formatter API documentation](https://github.com/twada/power-assert-formatter#api) for details.

#### default values

customizable properties and their default values are as follows.

```
var assert = require('power-assert').customize({
    assertion: {
        destructive: false,
        modifyMessageOnRethrow: true,
        saveContextOnRethrow: true,
        patterns: [
            'assert(value, [message])',
            'assert.ok(value, [message])',
            'assert.equal(actual, expected, [message])',
            'assert.notEqual(actual, expected, [message])',
            'assert.strictEqual(actual, expected, [message])',
            'assert.notStrictEqual(actual, expected, [message])',
            'assert.deepEqual(actual, expected, [message])',
            'assert.notDeepEqual(actual, expected, [message])'
        ]
    },
    output: {
        lineDiffThreshold: 5,
        maxDepth: 1,
        anonymous: 'Object',
        circular: '#@Circular#',
        lineSeparator: '\n',
        ambiguousEastAsianCharWidth: 2,
        widthOf: (Function to calculate width of string. Please see power-assert-formatter's documentation)
        stringify: (Function to stringify any target value. Please see power-assert-formatter's documentation)
        diff: (Function to create diff string between two strings. Please see power-assert-formatter's documentation)
        writerClass: (Constructor Function for output writer class. Please see power-assert-formatter's documentation)
        renderers: [
            './built-in/file',
            './built-in/assertion',
            './built-in/diagram',
            './built-in/binary-expression'
        ]
    }
});
```


INTERNAL DESIGN
---------------------------------------

`power-assert` family provides 1 main module, 4 core modules and many more instrumentors.


Main (facade) module is,

| module | description |
|:-------|:------------|
| [power-assert](http://github.com/twada/power-assert) | Standard `assert` function on top of `empower` and `power-assert-formatter` |

core modules are,

| module | description |
|:-------|:------------|
| [empower](http://github.com/twada/empower) | Power Assert feature enhancer for assert function/object. |
| [power-assert-formatter](http://github.com/twada/power-assert-formatter) | Power Assert output formatter. |
| [espower](http://github.com/twada/espower) | Power Assert feature instrumentor core based on the [Mozilla JavaScript AST](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API). |
| [espower-source](http://github.com/twada/espower-source) | Power Assert instrumentor from source to source, with source-map. (Thin wrapper of `espower`). |

and instrumentors are,

| module | description |
|:-------|:------------|
| [espower-cli](http://github.com/twada/espower-cli) | Command line tool for power-assert. |
| [espower-loader](http://github.com/twada/espower-loader) | Node module loader to apply `espower` on the fly. |
| [intelli-espower-loader](https://github.com/azu/intelli-espower-loader) | configure `espower-loader` with ease. |
| [espowerify](http://github.com/twada/espowerify) | [Browserify](http://browserify.org/) transform to apply `espower` to target files. |
| [grunt-espower](http://github.com/twada/grunt-espower) | Grunt task to apply `espower` to target files. |
| [gulp-espower](http://github.com/twada/gulp-espower) | Gulp plugin to apply `espower` to target files. |
| [karma-espower-preprocessor](https://github.com/vvakame/karma-espower-preprocessor) | karma-preprocessor for power-assert. |
| [espower-coffee](http://github.com/twada/espower-coffee) | power-assert instrumentor for CoffeeScript. |
| [espower-traceur](https://github.com/yosuke-furukawa/espower-traceur) | power-assert instrumentor for ES6 using [Traceur Compiler](https://github.com/google/traceur-compiler/). |
| [espower-6to5](https://github.com/azu/espower-6to5) | power-assert instrumentor for ES6 using [6to5](https://6to5.org/). |


`power-assert` provides standard [assert](http://nodejs.org/api/assert.html) compatible function with Power Assert feature.
(Best fit with [Mocha](http://visionmedia.github.io/mocha/). If you use assert-like objects provided by various testing frameworks such as [QUnit](http://qunitjs.com/) or [nodeunit](https://github.com/caolan/nodeunit). Please use [empower](http://github.com/twada/empower) and [power-assert-formatter](http://github.com/twada/power-assert-formatter) modules directly).


Internally, `power-assert` uses [empower](http://github.com/twada/empower) module to enhance power assert feature into the standard [assert](http://nodejs.org/api/assert.html) module, to run with the power assert feature added code by [espower](http://github.com/twada/espower) module, and prettify output using [power-assert-formatter](http://github.com/twada/power-assert-formatter).


See [power-assert-demo](http://github.com/twada/power-assert-demo) project for power-assert Demo running with mocha.


TESTED FRAMEWORKS
---------------------------------------
* [Mocha](http://visionmedia.github.io/mocha/)
* [QUnit](http://qunitjs.com/)
* [nodeunit](https://github.com/caolan/nodeunit)
* [buster-assertions](http://docs.busterjs.org/en/latest/modules/buster-assertions/)


TESTED ENVIRONMENTS
---------------------------------------
* [Node.js](http://nodejs.org/)
* [Rhino](https://developer.mozilla.org/en/Rhino)
* [PhantomJS](http://phantomjs.org/)
* [RequireJS](http://requirejs.org/)
* [Browserify](http://browserify.org/)


AUTHOR
---------------------------------------
* [Takuto Wada](http://github.com/twada)


CONTRIBUTORS
---------------------------------------
* [azu](https://github.com/azu)
* [vvakame](https://github.com/vvakame)


LICENSE
---------------------------------------
Licensed under the [MIT](https://github.com/twada/power-assert/blob/master/MIT-LICENSE.txt) license.



MORE OUTPUT EXAMPLES
---------------------------------------

### Target test code (using QUnit in this example)

```javascript
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
```


### `espower` code above then running under Node.js
    
```
# module: undefined
# test: spike
ok 1 - okay
not ok 2 - comment # /path/to/examples/qunit_node.js:17
#
# assert.ok(hoge === fuga, 'comment')
#           |    |   |
#           |    |   "bar"
#           |    false
#           "foo"
#
# --- [string] fuga
# +++ [string] hoge
# @@ -1,3 +1,3 @@
# -bar
# +foo
#
# , test: spike
not ok 3 - # /path/to/examples/qunit_node.js:20
#
# assert.ok(fuga === piyo)
#           |    |   |
#           |    |   3
#           |    false
#           "bar"
#
# [number] piyo
# => 3
# [string] fuga
# => "bar"

# , test: spike
not ok 4 - # /path/to/examples/qunit_node.js:24
#
# assert.ok(longString === anotherLongString)
#           |          |   |
#           |          |   "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
#           |          false
#           "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
#
# --- [string] anotherLongString
# +++ [string] longString
# @@ -1,15 +1,13 @@
# -yet anoth
# +very v
#  er
# +y
#   loo
#
# , test: spike
not ok 5 - # /path/to/examples/qunit_node.js:26
#
# assert.ok(4 === piyo)
#             |   |
#             |   3
#             false
#
# [number] piyo
# => 3
# [number] 4
# => 4
# , test: spike
not ok 6 - # /path/to/examples/qunit_node.js:28
#
# assert.ok(4 !== 4)
#             |
#             false
# , test: spike
not ok 7 - # /path/to/examples/qunit_node.js:31
#
# assert.ok(falsyStr)
#           |
#           ""
# , test: spike
not ok 8 - # /path/to/examples/qunit_node.js:34
#
# assert.ok(falsyNum)
#           |
#           0
# , test: spike
not ok 9 - # /path/to/examples/qunit_node.js:38
#
# assert.ok(ary1.length === ary2.length)
#           |    |      |   |    |
#           |    |      |   |    3
#           |    |      |   ["aaa","bbb","ccc"]
#           |    2      false
#           ["foo","bar"]
#
# [number] ary2.length
# => 3
# [number] ary1.length
# => 2
# , test: spike
not ok 10 - # /path/to/examples/qunit_node.js:39
#
# assert.deepEqual(ary1, ary2)
#                  |     |
#                  |     ["aaa","bbb","ccc"]
#                  ["foo","bar"]
# , expected: [
#   "aaa",
#   "bbb",
#   "ccc"
# ], got: [
#   "foo",
#   "bar"
# ], test: spike
not ok 11 - # /path/to/examples/qunit_node.js:42
#
# assert.ok(5 < actual && actual < 13)
#             | |      |  |      |
#             | |      |  16     false
#             | 16     false
#             true
# , test: spike
not ok 12 - # /path/to/examples/qunit_node.js:45
#
# assert.ok(5 < actual && actual < 13)
#             | |      |
#             | 4      false
#             false
# , test: spike
not ok 13 - # /path/to/examples/qunit_node.js:48
#
# assert.ok(actual < 5 || 13 < actual)
#           |      |   |     | |
#           |      |   |     | 10
#           |      |   false false
#           10     false
# , test: spike
not ok 14 - # /path/to/examples/qunit_node.js:58
#
# assert.ok(foo.bar.baz)
#           |   |   |
#           |   |   false
#           |   Object{baz:false}
#           Object{bar:#Object#}
# , test: spike
not ok 15 - # /path/to/examples/qunit_node.js:59
#
# assert.ok(foo['bar'].baz)
#           |  |       |
#           |  |       false
#           |  Object{baz:false}
#           Object{bar:#Object#}
# , test: spike
not ok 16 - # /path/to/examples/qunit_node.js:60
#
# assert.ok(foo[propName]['baz'])
#           |  ||        |
#           |  |"bar"    false
#           |  Object{baz:false}
#           Object{bar:#Object#}
# , test: spike
not ok 17 - # /path/to/examples/qunit_node.js:64
#
# assert.ok(!truth)
#           ||
#           |true
#           false
# , test: spike
not ok 18 - # /path/to/examples/qunit_node.js:68
#
# assert.ok(func())
#           |
#           false
# , test: spike
not ok 19 - # /path/to/examples/qunit_node.js:76
#
# assert.ok(obj.age())
#           |   |
#           |   0
#           Object{age:#function#}
# , test: spike
not ok 20 - # /path/to/examples/qunit_node.js:83
#
# assert.ok(isFalsy(positiveInt))
#           |       |
#           false   50
# , test: spike
not ok 21 - # /path/to/examples/qunit_node.js:94
#
# assert.ok(sum(one, two, three) === seven)
#           |   |    |    |      |   |
#           |   |    |    |      |   7
#           6   1    2    3      false
#
# [number] seven
# => 7
# [number] sum(one, two, three)
# => 6
# , test: spike
not ok 22 - # /path/to/examples/qunit_node.js:95
#
# assert.ok(sum(sum(one, two), three) === sum(sum(two, three), seven))
#           |   |   |    |     |      |   |   |   |    |       |
#           |   |   |    |     |      |   12  5   2    3       7
#           6   3   1    2     3      false
#
# [number] sum(sum(two, three), seven)
# => 12
# [number] sum(sum(one, two), three)
# => 6
# , test: spike
not ok 23 - # /path/to/examples/qunit_node.js:96
#
# assert.ok(three * (seven * ten) === three)
#           |     |  |     | |    |   |
#           |     |  |     | |    |   3
#           |     |  |     | 10   false
#           |     |  7     70
#           3     210
#
# [number] three
# => 3
# [number] three * (seven * ten)
# => 210
# , test: spike
not ok 24 - # /path/to/examples/qunit_node.js:110
#
# assert.ok(math.calc.sum(one, two, three) === seven)
#           |    |    |   |    |    |      |   |
#           |    |    |   |    |    |      |   7
#           |    |    6   1    2    3      false
#           |    Object{sum:#function#}
#           Object{calc:#Object#}
#
# [number] seven
# => 7
# [number] math.calc.sum(one, two, three)
# => 6
# , test: spike
1..24
```

Have fun!


[npm-url]: https://npmjs.org/package/power-assert
[npm-image]: https://badge.fury.io/js/power-assert.svg

[travis-url]: http://travis-ci.org/twada/power-assert
[travis-image]: https://secure.travis-ci.org/twada/power-assert.svg?branch=master

[depstat-url]: https://gemnasium.com/twada/power-assert
[depstat-image]: https://gemnasium.com/twada/power-assert.svg

[license-url]: https://github.com/twada/power-assert/blob/master/MIT-LICENSE.txt
[license-image]: http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat
