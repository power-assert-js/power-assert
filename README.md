[![power-assert][power-assert-banner]][power-assert-url]

Power Assert in JavaScript. Provides descriptive assertion messages through standard [assert](https://nodejs.org/api/assert.html) interface. No API is the best API.

[![Build Status][travis-image]][travis-url]
[![NPM package][npm-image]][npm-url]
[![Bower package][bower-image]][bower-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]


DESCRIPTION
---------------------------------------

What is `power-assert`?

 * is an implementation of "Power Assert" concept in JavaScript.
 * provides descriptive assertion messages through standard [assert](http://nodejs.org/api/assert.html) interface.
 * __No API is the best API__. With power-assert, __you don't need to learn many assertion library APIs__ (in most cases, all you need to remember is just an `assert(any_expression)` function)
 * __Stop memorizing an assertion API. Just create expressions that return a truthy value or not__ and power-assert will show it to your right on the screen as part of your failure message without you having to type in a message at all.
 * the core value of power-assert is absolute simplicity and stability. Especially, power-assert sticks to the simplest form of testing, `assert(any_expression)`.
 * see slides: ["power-assert, mechanism and philosophy"](http://www.slideshare.net/t_wada/power-assert-nodefest-2014) -- talk at NodeFest 2014.
 * to gain power-assert output, __you need to transform your test code__ to produce power-assert output (without transformation, power-assert works just as normal `assert` does).
 * fully compatible with [assert](http://nodejs.org/api/assert.html). So you can stop using power-assert and back to assert easily.
 * has [online demo site](http://azu.github.io/power-assert-demo/).
 * works both on server side and browser side.
 * available via [npm](https://www.npmjs.com/package/power-assert) and [bower](http://bower.io/search/?q=power-assert). 
 * supports sourcemaps so you can debug as usual.
 * provides [babel plugin](https://github.com/power-assert-js/babel-plugin-espower) and [babel preset](https://github.com/power-assert-js/babel-preset-power-assert).
 * provides [browserify transform](https://github.com/power-assert-js/espowerify).
 * provides [webpack loader](https://github.com/power-assert-js/webpack-espower-loader).
 * provides [grunt task](https://github.com/power-assert-js/grunt-espower) and [gulp plugin](https://github.com/power-assert-js/gulp-espower).
 * provides [command](https://github.com/power-assert-js/espower-cli).
 * provides [custom module loader](https://github.com/power-assert-js/espower-loader) and its [convenient config module](https://github.com/power-assert-js/intelli-espower-loader).
 * provides [karma preprocessor](https://github.com/power-assert-js/karma-espower-preprocessor).
 * supports ES6 through [babel plugin](https://github.com/power-assert-js/babel-plugin-espower), [module loader for Traceur Compiler](https://github.com/power-assert-js/espower-traceur), and [module loader for Babel](https://github.com/power-assert-js/espower-babel).
 * supports [CoffeeScript](https://github.com/power-assert-js/espower-coffee).
 * supports [TypeScript](https://github.com/power-assert-js/espower-typescript).
 * has [TypeScript type definition](https://github.com/borisyankov/DefinitelyTyped/blob/master/power-assert/power-assert.d.ts)
 * [AVA](https://github.com/sindresorhus/ava), futuristic test runner, now [comes with power-assert builtin](https://github.com/sindresorhus/ava#enhanced-asserts)
 * pull-requests, issue reports and patches are always welcomed.


`power-assert` provides descriptive assertion messages for your tests, like this.

      1) Array #indexOf() should return index when the value is present:
         AssertionError: # path/to/test/mocha_node.js:10
    
      assert(this.ary.indexOf(zero) === two)
                  |   |       |     |   |
                  |   |       |     |   2
                  |   -1      0     false
                  [1,2,3]
    
      [number] two
      => 2
      [number] this.ary.indexOf(zero)
      => -1


FAQ
---------------------------------------

- [Support other assertion styles?](https://github.com/power-assert-js/power-assert/issues/22)
- [Does this work with substack/tape?](https://github.com/power-assert-js/power-assert/issues/30)
- [Are all dependencies required at runtime?](https://github.com/power-assert-js/power-assert/issues/24)
- [Descriptive assertion message does not appear when writing tests in ES6 with Babel](https://github.com/power-assert-js/webpack-espower-loader/issues/4#issuecomment-139605343)
- [Incomplete increment/decrement assertion messages?](https://github.com/power-assert-js/power-assert/issues/32)
- [Cannot capture not invokable method error](https://github.com/power-assert-js/power-assert/issues/36)
- What is the ['Critical dependencies' warning shown by webpack](https://github.com/power-assert-js/babel-plugin-espower/issues/14#issuecomment-197272436) and how to [suppress warnings](https://github.com/power-assert-js/babel-plugin-espower/issues/14#issuecomment-197909419)?
- [Causes `TypeError: assert._capt is not a function`](https://github.com/power-assert-js/power-assert/issues/42)
- [How to deal with `assert` calls in production](https://github.com/power-assert-js/power-assert/issues/43#issuecomment-208851919)


INSTALL
---------------------------------------

`npm install --save-dev power-assert <one of instrumentors>`

or

```
bower install --save-dev power-assert
npm install --save-dev <one of instrumentors>
```

see [list of instrumentors](https://github.com/power-assert-js/power-assert#be-sure-to-transform-test-code)


API
---------------------------------------

power-assert enhances these assert functions by [espower](https://github.com/power-assert-js/espower). Produces descriptive message when assertion is failed.

* `assert(value, [message])`
* `assert.ok(value, [message])`
* `assert.equal(actual, expected, [message])`
* `assert.notEqual(actual, expected, [message])`
* `assert.strictEqual(actual, expected, [message])`
* `assert.notStrictEqual(actual, expected, [message])`
* `assert.deepEqual(actual, expected, [message])`
* `assert.notDeepEqual(actual, expected, [message])`
* `assert.deepStrictEqual(actual, expected, [message])`
* `assert.notDeepStrictEqual(actual, expected, [message])`

power-assert is fully compatible with [assert](http://nodejs.org/api/assert.html). So functions below are also available though they are not enhanced (does not produce descriptive message).

* `assert.fail(actual, expected, message, operator)`
* `assert.throws(block, [error], [message])`
* `assert.doesNotThrow(block, [message])`
* `assert.ifError(value)`

power-assert provides an [API for customization](https://github.com/power-assert-js/power-assert#customization-api).

* `assert.customize(options)`


### No API is the best API

Though power-assert is fully compatible with standard [assert](http://nodejs.org/api/assert.html) interface, all you need to remember is just an `assert(any_expression)` function in most cases.

The core value of power-assert is absolute simplicity and stability. Especially, power-assert sticks to the simplest form of testing, `assert(any_expression)`.


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


CHANGELOG
---------------------------------------
See [CHANGELOG](https://github.com/power-assert-js/power-assert/blob/master/CHANGELOG.md)


EXAMPLE
---------------------------------------

See [HOW TO USE](https://github.com/power-assert-js/power-assert#how-to-use) section for more details.

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

 - [espower-loader](https://github.com/power-assert-js/espower-loader) (with [intelli-espower-loader](https://github.com/power-assert-js/intelli-espower-loader))
 - [espower-cli](http://github.com/power-assert-js/espower-cli)
 - [espowerify](http://github.com/power-assert-js/espowerify)
 - [webpack-espower-loader](https://github.com/power-assert-js/webpack-espower-loader).
 - [grunt-espower](http://github.com/power-assert-js/grunt-espower)
 - [gulp-espower](http://github.com/power-assert-js/gulp-espower)
 - [karma-espower-preprocessor](https://github.com/power-assert-js/karma-espower-preprocessor)
 - [espower-coffee](http://github.com/power-assert-js/espower-coffee)
 - [espower-typescript](http://github.com/power-assert-js/espower-typescript)
 - [espower-traceur](https://github.com/power-assert-js/espower-traceur)
 - [espower-babel](https://github.com/power-assert-js/espower-babel)
 - [babel-plugin-espower](https://github.com/power-assert-js/babel-plugin-espower)
 - [babel-preset-power-assert](https://github.com/power-assert-js/babel-preset-power-assert)

If you are using Node.js only, the easiest way is to use [intelli-espower-loader](https://github.com/power-assert-js/intelli-espower-loader). Steps are as follows.


### Setup

`npm install --save-dev mocha power-assert intelli-espower-loader`


### Run

Put tests into `test` directory then run. You will see the power-assert output appears.

      $ $(npm bin)/mocha --require intelli-espower-loader path/to/test/mocha_node.js
    
    
      Array
        #indexOf()
          1) should return index when the value is present
          2) should return -1 when the value is not present
    
      various types
        3) demo
    
    
      0 passing (43ms)
      3 failing
    
      1) Array #indexOf() should return index when the value is present:
    
          AssertionError:   # test/mocha_node.js:10
    
      assert(this.ary.indexOf(zero) === two)
                  |   |       |     |   |
                  |   |       |     |   2
                  |   -1      0     false
                  [1,2,3]
    
      [number] two
      => 2
      [number] this.ary.indexOf(zero)
      => -1
    
          + expected - actual
    
          -false
          +true
    
          at Context.<anonymous> (test/mocha_node.js:10:13)
    
      2) Array #indexOf() should return -1 when the value is not present:
    
          AssertionError: THIS IS AN ASSERTION MESSAGE   # test/mocha_node.js:14
    
      assert.ok(this.ary.indexOf(two) === minusOne, 'THIS IS AN ASSERTION MESSAGE')
                     |   |       |    |   |
                     |   |       |    |   -1
                     |   1       2    false
                     [1,2,3]
    
      [number] minusOne
      => -1
      [number] this.ary.indexOf(two)
      => 1
    
          + expected - actual
    
          -false
          +true
    
          at Context.<anonymous> (test/mocha_node.js:14:20)
    
      3) various types demo:
    
          AssertionError:   # test/mocha_node.js:37
    
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
    
    
          + expected - actual
    
          -false
          +true
    
          at Context.<anonymous> (test/mocha_node.js:37:9)


SEED PROJECTS
---------------------------------------

Some seed projects are available to help you start with power-assert.

| module | env | tech stack |
|:-------|:------------|:------------|
| [power-assert-node-seed](https://github.com/azu/power-assert-node-seed) | Node.js | power-assert + [intelli-espower-loader](https://github.com/power-assert-js/intelli-espower-loader) |
| [power-assert-testem-seed](https://github.com/azu/power-assert-testem-seed) | Browsers(by [testem](https://github.com/testem/testem)) | power-assert + [gulp-espower](http://github.com/power-assert-js/gulp-espower) + [testem](https://github.com/airportyh/testem). |
| [power-assert-karma-seed](https://github.com/azu/power-assert-karma-seed) | Browsers(by [Karma](http://karma-runner.github.io/)) | power-assert + [espowerify](http://github.com/power-assert-js/espowerify) + [browserify](http://browserify.org/) + [Karma](http://karma-runner.github.io/). |


HOW TO USE
---------------------------------------

There are four ways to use power-assert. (If you want to see running examples, see [SEED PROJECTS](#seed-projects))

1. `power-assert` + `espower-loader`: Highly recommended but only works under Node.
2. `power-assert` + `Babel` + `babel-preset-power-assert`:  Recommended if you are writing ES6 with [Babel](https://babeljs.io/) or [babelify](https://github.com/babel/babelify) with [browserify](http://browserify.org/)
3. `power-assert` + `espower-coffee` or `espower-typescript` or `espower-traceur` or `espower-babel` : Use power-assert through transpilers. Recommended but only works under Node.
4. `power-assert` + `espowerify` or `webpack-espower-loader`: Recommended if you are using [browserify](http://browserify.org/) or [webpack](http://webpack.github.io/).
5. `power-assert` + `espower-cli` or `grunt-espower` or `gulp-espower` : Generate instrumented code so works anywhere.


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

    $ $(npm bin)/mocha --require ./path/to/enable-power-assert test/your_test.js


FYI: You may be interested in [intelli-espower-loader](https://github.com/power-assert-js/intelli-espower-loader) to go one step further. With [intelli-espower-loader](https://github.com/power-assert-js/intelli-espower-loader), you don't need to create loader file (like `enable-power-assert.js`). Just define test directory in `package.json` wow!


### using `espower-coffee`

If you are writing Node.js app/module in CoffeeScript, you can instrument Power Assert feature without code generation by using `espower-coffee`.

see [espower-coffee README](https://github.com/power-assert-js/espower-coffee).


### using `espower-typescript`

If you are writing Node.js app/module in TypeScript, you can instrument Power Assert feature without code generation by using `espower-typescript`.

see [espower-typescript README](https://github.com/power-assert-js/espower-typescript).


### using `babel-preset-power-assert` or `babel-plugin-espower`

If you are writing your code in ES6, you can instrument Power Assert feature with Babel and babel-preset-power-assert (or babel-plugin-espower).

see [babel-plugin-espower README](https://github.com/power-assert-js/babel-plugin-espower) and [babel-preset-power-assert README](https://github.com/power-assert-js/babel-preset-power-assert)


### using `espower-traceur` or `espower-babel`

If you are writing Node.js app/module in ES6, you can instrument Power Assert feature without code generation by using `espower-traceur` or `espower-babel`. `espower-traceur` uses [Traceur Compiler](https://github.com/google/traceur-compiler/), `espower-babel` uses [Babel](https://babeljs.io/).

see [espower-traceur README](https://github.com/power-assert-js/espower-traceur) or [espower-babel README](https://github.com/power-assert-js/espower-babel).


### using `espowerify`

On the browser side and you are using [browserify](http://browserify.org/), you can instrument Power Assert feature via `espowerify`.

see [espowerify README](https://github.com/power-assert-js/espowerify).


### using `webpack-espower-loader`

If you are using [webpack](http://webpack.github.io/), you can instrument Power Assert feature via `webpack-espower-loader`.

see [webpack-espower-loader README](https://github.com/power-assert-js/webpack-espower-loader).



### using `espower-cli`

On the browser side and you don't want to use grunt,gulp or browserify, you can use `power-assert` via bower, with generated code by `espower-cli`

First, install `power-assert` via bower and `espower-cli` via npm. This means that you run `espower` command (on Node), then run tests on browser.

    $ bower install --save-dev power-assert
    $ npm install --save-dev espower-cli

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

customization options for [empower](https://github.com/power-assert-js/empower) module. See [empower API documentation](https://github.com/power-assert-js/empower#api) for details. Note that some default values are different from `empower`'s (`modifyMessageOnRethrow: true` and `saveContextOnRethrow: true`).

#### options.output

customization options for [power-assert-formatter](https://github.com/power-assert-js/power-assert-formatter) module. See [power-assert-formatter API documentation](https://github.com/power-assert-js/power-assert-formatter#api) for details.

#### default values

customizable properties and their default values are as follows.

```javascript
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
            'assert.notDeepEqual(actual, expected, [message])',
            'assert.deepStrictEqual(actual, expected, [message])',
            'assert.notDeepStrictEqual(actual, expected, [message])'
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
| [power-assert](https://github.com/power-assert-js/power-assert) | Standard `assert` function on top of `empower` and `power-assert-formatter` |

core modules are,

| module | description |
|:-------|:------------|
| [empower](http://github.com/power-assert-js/empower) | Power Assert feature enhancer for assert function/object. |
| [power-assert-formatter](http://github.com/power-assert-js/power-assert-formatter) | Power Assert output formatter. |
| [espower](http://github.com/power-assert-js/espower) | Power Assert feature instrumentor core based on the ECMAScript AST defined in [The ESTree Spec](https://github.com/estree/estree) (formerly known as [Mozilla SpiderMonkey Parser API](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)). |
| [espower-source](https://github.com/power-assert-js/espower-source) | Power Assert instrumentor from source to source, with source-map. (Thin wrapper of `espower`). |

and instrumentors are,

| module | description |
|:-------|:------------|
| [espower-cli](http://github.com/power-assert-js/espower-cli) | Command line tool for power-assert. |
| [espower-loader](http://github.com/power-assert-js/espower-loader) | Node module loader to apply `espower` on the fly. |
| [intelli-espower-loader](https://github.com/power-assert-js/intelli-espower-loader) | configure `espower-loader` with ease. |
| [babel-plugin-espower](https://github.com/power-assert-js/babel-plugin-espower) | [Babel](https://babeljs.io/) plugin to instrument power-assert feature into target files. |
| [babel-preset-power-assert](https://github.com/power-assert-js/babel-preset-power-assert) | [Babel](https://babeljs.io/) preset to instrument power-assert feature into target files. |
| [espowerify](http://github.com/power-assert-js/espowerify) | [Browserify](http://browserify.org/) transform to apply `espower` to target files. |
| [webpack-espower-loader](https://github.com/power-assert-js/webpack-espower-loader) | Power Assert instrumentor module for [webpack](http://webpack.github.io/). |
| [grunt-espower](http://github.com/power-assert-js/grunt-espower) | Grunt task to apply `espower` to target files. |
| [gulp-espower](http://github.com/power-assert-js/gulp-espower) | Gulp plugin to apply `espower` to target files. |
| [karma-espower-preprocessor](https://github.com/power-assert-js/karma-espower-preprocessor) | karma-preprocessor for power-assert. |
| [espower-coffee](http://github.com/power-assert-js/espower-coffee) | power-assert instrumentor for CoffeeScript. |
| [espower-typescript](http://github.com/power-assert-js/espower-typescript) | power-assert instrumentor for TypeScript. |
| [espower-traceur](https://github.com/power-assert-js/espower-traceur) | power-assert instrumentor for ES6 using [Traceur Compiler](https://github.com/google/traceur-compiler/). |
| [espower-babel](https://github.com/power-assert-js/espower-babel) | power-assert instrumentor for ES6 using [Babel](https://babeljs.io/). |


`power-assert` provides standard [assert](http://nodejs.org/api/assert.html) compatible function with Power Assert feature.
(Best fit with [Mocha](http://visionmedia.github.io/mocha/). If you use assert-like objects provided by various testing frameworks such as [QUnit](http://qunitjs.com/) or [nodeunit](https://github.com/caolan/nodeunit). Please use [empower](http://github.com/power-assert-js/empower) and [power-assert-formatter](http://github.com/power-assert-js/power-assert-formatter) modules directly).


Internally, `power-assert` uses [empower](http://github.com/power-assert-js/empower) module to enhance power assert feature into the standard [assert](http://nodejs.org/api/assert.html) module, to run with the power assert feature added code by [espower](http://github.com/power-assert-js/espower) module, and prettify output using [power-assert-formatter](http://github.com/power-assert-js/power-assert-formatter).


See [power-assert-demo](https://github.com/twada/power-assert-demo) project for power-assert Demo running with mocha.


SUPPORTED FRAMEWORKS
---------------------------------------

* [Mocha](http://visionmedia.github.io/mocha/)
* [AVA](https://github.com/sindresorhus/ava)


### FRAMEWORKS KNOWN TO WORK

* [QUnit](http://qunitjs.com/)
* [nodeunit](https://github.com/caolan/nodeunit)
* [buster-assertions](http://docs.busterjs.org/en/latest/modules/buster-assertions/)


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


CONTRIBUTORS
---------------------------------------
* [azu (azu)](https://github.com/azu)
* [vvakame (Masahiro Wakame)](https://github.com/vvakame)
* [yosuke-furukawa (Yosuke Furukawa)](https://github.com/yosuke-furukawa)
* [teppeis (Teppei Sato)](https://github.com/teppeis)
* [zoncoen (Kenta Mori)](https://github.com/zoncoen)
* [falsandtru (falsandtru)](https://github.com/falsandtru)
* [James Talmage (jamestalmage)](https://github.com/jamestalmage)
* [LeshaKoss (Lesha Koss)](https://github.com/LeshaKoss)


LICENSE
---------------------------------------
Licensed under the [MIT](https://github.com/power-assert-js/power-assert/blob/master/MIT-LICENSE.txt) license.



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
not ok 2 - comment # path/to/examples/qunit_node.js:17
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
not ok 3 - # path/to/examples/qunit_node.js:20
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
not ok 4 - # path/to/examples/qunit_node.js:24
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
not ok 5 - # path/to/examples/qunit_node.js:26
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
not ok 6 - # path/to/examples/qunit_node.js:28
#
# assert.ok(4 !== 4)
#             |
#             false
# , test: spike
not ok 7 - # path/to/examples/qunit_node.js:31
#
# assert.ok(falsyStr)
#           |
#           ""
# , test: spike
not ok 8 - # path/to/examples/qunit_node.js:34
#
# assert.ok(falsyNum)
#           |
#           0
# , test: spike
not ok 9 - # path/to/examples/qunit_node.js:38
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
not ok 10 - # path/to/examples/qunit_node.js:39
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
not ok 11 - # path/to/examples/qunit_node.js:42
#
# assert.ok(5 < actual && actual < 13)
#             | |      |  |      |
#             | |      |  16     false
#             | 16     false
#             true
# , test: spike
not ok 12 - # path/to/examples/qunit_node.js:45
#
# assert.ok(5 < actual && actual < 13)
#             | |      |
#             | 4      false
#             false
# , test: spike
not ok 13 - # path/to/examples/qunit_node.js:48
#
# assert.ok(actual < 5 || 13 < actual)
#           |      |   |     | |
#           |      |   |     | 10
#           |      |   false false
#           10     false
# , test: spike
not ok 14 - # path/to/examples/qunit_node.js:58
#
# assert.ok(foo.bar.baz)
#           |   |   |
#           |   |   false
#           |   Object{baz:false}
#           Object{bar:#Object#}
# , test: spike
not ok 15 - # path/to/examples/qunit_node.js:59
#
# assert.ok(foo['bar'].baz)
#           |  |       |
#           |  |       false
#           |  Object{baz:false}
#           Object{bar:#Object#}
# , test: spike
not ok 16 - # path/to/examples/qunit_node.js:60
#
# assert.ok(foo[propName]['baz'])
#           |  ||        |
#           |  |"bar"    false
#           |  Object{baz:false}
#           Object{bar:#Object#}
# , test: spike
not ok 17 - # path/to/examples/qunit_node.js:64
#
# assert.ok(!truth)
#           ||
#           |true
#           false
# , test: spike
not ok 18 - # path/to/examples/qunit_node.js:68
#
# assert.ok(func())
#           |
#           false
# , test: spike
not ok 19 - # path/to/examples/qunit_node.js:76
#
# assert.ok(obj.age())
#           |   |
#           |   0
#           Object{age:#function#}
# , test: spike
not ok 20 - # path/to/examples/qunit_node.js:83
#
# assert.ok(isFalsy(positiveInt))
#           |       |
#           false   50
# , test: spike
not ok 21 - # path/to/examples/qunit_node.js:94
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
not ok 22 - # path/to/examples/qunit_node.js:95
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
not ok 23 - # path/to/examples/qunit_node.js:96
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
not ok 24 - # path/to/examples/qunit_node.js:110
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


[power-assert-url]: https://github.com/power-assert-js/power-assert
[power-assert-banner]: https://raw.githubusercontent.com/power-assert-js/power-assert-js-logo/master/banner/banner-official-fullcolor.png

[npm-url]: https://www.npmjs.com/package/power-assert
[npm-image]: https://badge.fury.io/js/power-assert.svg

[bower-url]: http://badge.fury.io/bo/power-assert
[bower-image]: https://badge.fury.io/bo/power-assert.svg

[travis-url]: https://travis-ci.org/power-assert-js/power-assert
[travis-image]: https://secure.travis-ci.org/power-assert-js/power-assert.svg?branch=master

[depstat-url]: https://gemnasium.com/power-assert-js/power-assert
[depstat-image]: https://gemnasium.com/power-assert-js/power-assert.svg

[license-url]: https://github.com/power-assert-js/power-assert/blob/master/MIT-LICENSE.txt
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat
