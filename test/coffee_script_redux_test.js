var q = require('../test_helper').QUnit,
    _pa_ = require('../lib/module').useDefault(),
    empower = require('../lib/empower'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    CoffeeScript = require('coffee-script-redux');


q.module('CoffeeScriptRedux learning & spike');

q.test('with CoffeeScriptRedux toolchain', function (assert) {
    var csCode = 'assert.ok dog.speak() == says';

    var parseOptions = {raw: true};
    var csAST = CoffeeScript.parse(csCode, parseOptions);

    var compileOptions = {bare: false};
    var jsAST = CoffeeScript.compile(csAST, compileOptions);

    assert.ok(jsAST);

    //console.log(JSON.stringify(jsAST, null, 4));
    var empoweredAst = empower(jsAST, {destructive: false, source: csCode, path: '/path/to/foo_test.coffee'});

    var jsGenerateOptions = {compact: true};
    var jsCode = CoffeeScript.js(empoweredAst, jsGenerateOptions);
    assert.equal(jsCode, "assert.ok(_pa_.expr(_pa_.binary(_pa_.funcall(_pa_.ident(dog,{start:{line:1,column:10}}).speak(),{start:{line:1,column:14}})===_pa_.ident(says,{start:{line:1,column:25}}),{start:{line:1,column:22}}),{start:{line:1,column:10},path:'/path/to/foo_test.coffee'},'assert.ok dog.speak() == says'))");
});


q.module('CoffeeScriptRedux integration', {
    setup: function () {
        var that = this;
        that.lines = [];
        this.origPuts = _pa_.puts;
        _pa_.puts = function (str) {
            that.lines.push(str);
        };
    },
    teardown: function () {
        _pa_.puts = this.origPuts;
    }
});

var empowerCoffee = function () {
    var extractBodyOfAssertionAsCode = function (node) {
        var expression;
        if (node.type === 'ExpressionStatement') {
            expression = node.expression;
        } else if (node.type === 'ReturnStatement') {
            expression = node.argument;
        }
        return escodegen.generate(expression.arguments[0], {format: {compact: true}});
    };
    return function (csCode) {
        var parseOptions = {raw: true},
            csAST = CoffeeScript.parse(csCode, parseOptions),
            compileOptions = {bare: false},
            jsAST = CoffeeScript.compile(csAST, compileOptions),
            empoweredAst = empower(jsAST, {destructive: false, source: csCode, path: '/path/to/bar_test.coffee'}),
            expression = empoweredAst.body[0],
            instrumentedCode = extractBodyOfAssertionAsCode(expression);
        //tap.note(instrumentedCode);
        return instrumentedCode;
    };
}();


q.test('assert.ok dog.speak() == says', function () {
    var dog = { speak: function () { return 'woof'; } },
        says = 'meow';
    eval(empowerCoffee('assert.ok dog.speak() == says'));
    q.assert.deepEqual(this.lines, [
        '# /path/to/bar_test.coffee:1',
        '',
        'assert.ok dog.speak() == says',
        '          |   |       |  |   ',
        '          |   |       |  "meow"',
        '          {}  "woof"  false  ',
        ''
    ]);
});
