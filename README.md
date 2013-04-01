power-assert.js - Empower your assertions
================================


DESCRIPTION
---------------------------------------
power-assert.js is a experimental implementation of "Power Assert" in JavaScript, powered by [Esprima](http://esprima.org/) and [Escodegen](https://github.com/Constellation/escodegen).

power-assert.js is an alpha version product, so backward compatibility breaking changes will be occurred very often. Pull-requests, issue reports and patches are always welcome.


HOW TO USE
---------------------------------------

First, install power-assert via `npm`.

    $ npm install power-assert

Second, generate empowered code using `empower` command (Add `--module=commonjs` option if you run generated code with Node).

    $ empower --module=commonjs your_test.js > your_test_empowered.js

Then run your test in your way (just using `node` in this example. However, without `--module=commonjs`, generated code does *NOT* depend on Node).

    $ node your_test_empowered.js


OUTPUT EXAMPLE
---------------------------------------

### Target test code (using QUnit in this example)

    var q = require('qunitjs');
    
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
    });
    


### `empower` code above then running under Node.js
    
    # at line: 8
        assert.ok(hoge === fuga, 'comment');
                  ^^^^     ^^^^             
                  |        |                
                  |        "bar"            
                  "foo"                     
    
    # at line: 11
        assert.ok(fuga === piyo);
                  ^^^^     ^^^^  
                  |        |     
                  |        3     
                  "bar"          
    
    # at line: 15
        assert.ok(longString === anotherLongString);
                  ^^^^^^^^^^     ^^^^^^^^^^^^^^^^^  
                  |              |                  
                  |              "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
                  "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
    
    # at line: 17
        assert.ok(4 === piyo);
                        ^^^^  
                        |     
                        3     
    
    # at line: 19
        assert.ok(4 !== 4);
                           
                           
    
    # at line: 22
        assert.ok(falsyStr);
                  ^^^^^^^^  
                  |         
                  ""        
    
    # at line: 25
        assert.ok(falsyNum);
                  ^^^^^^^^  
                  |         
                  0         
    
    # at line: 29
        assert.ok(ary1.length === ary2.length);
                  ^^^^ ^^^^^^     ^^^^ ^^^^^^  
                  |    |          |    |       
                  |    |          |    3       
                  |    |          ["aaa","bbb","ccc"]
                  |    2                       
                  ["foo","bar"]                
    
    # at line: 32
        assert.ok(5 < actual && actual < 13);
                      ^^^^^^    ^^^^^^       
                      |         |            
                      |         16           
                      16                     
    
    # at line: 35
        assert.ok(5 < actual && actual < 13);
                      ^^^^^^                 
                      |                      
                      4                      
    
    # at line: 38
        assert.ok(actual < 5 || 13 < actual);
                  ^^^^^^             ^^^^^^  
                  |                  |       
                  |                  10      
                  10                         
    
    # at line: 46
        assert.ok(foo.bar.baz);
                  ^^^ ^^^ ^^^  
                  |   |   |    
                  |   |   false
                  |   {"baz":false}
                  {"bar":{"baz":false}}
    
    # at line: 50
        assert.ok(!truth);
                   ^^^^^  
                   |      
                   true   
    


### (Another example) enpowering and running `assert` module on Node.js 

    # at line: 9
        assert(falsy);
               ^^^^^  
               |      
               ""     
    
    # at line: 14
        assert(fuga === piyo);
               ^^^^     ^^^^  
               |        |     
               |        "foo" 
               "bar"          
    
    # at line: 19
        assert(hoge === fuga);
               ^^^^     ^^^^  
               |        |     
               |        "bar" 
               "foo"          
    
    # at line: 25
        assert(fuga === piyo);
               ^^^^     ^^^^  
               |        |     
               |        3     
               "bar"          
    
    # at line: 32
        assert(longString === anotherLongString);
               ^^^^^^^^^^     ^^^^^^^^^^^^^^^^^  
               |              |                  
               |              "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
               "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
    


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
Licensed under the [MIT](https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt) license.
