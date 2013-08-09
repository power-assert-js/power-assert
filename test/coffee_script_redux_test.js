var q = require('../test_helper').QUnit,
    formatter = require('../lib/power-assert-formatter'),
    enhance = require('../lib/empower').enhance,
    powerAssertTextLines = [],
    _pa_ = enhance(q.assert, formatter, function (context, message) {
        powerAssertTextLines = formatter.format(context);
    }),
    espower = require('../lib/espower'),
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
    var espoweredAst = espower(jsAST, {destructive: false, source: csCode, path: '/path/to/foo_test.coffee', powerAssertVariableName: '_pa_'});

    var jsGenerateOptions = {compact: true};
    var jsCode = CoffeeScript.js(espoweredAst, jsGenerateOptions);
    assert.equal(jsCode, "assert.ok(_pa_.expr(_pa_.capture(_pa_.capture(_pa_.capture(dog,'ident',{start:{line:1,column:10}}).speak(),'funcall',{start:{line:1,column:14}})===_pa_.capture(says,'ident',{start:{line:1,column:25}}),'binary',{start:{line:1,column:22}}),{start:{line:1,column:10},path:'/path/to/foo_test.coffee'},'assert.ok dog.speak() == says'))");
});


q.module('CoffeeScriptRedux integration', {
    setup: function () {
        powerAssertTextLines.length = 0;
    }
});

var espowerCoffee = function () {
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
            espoweredAst = espower(jsAST, {destructive: false, source: csCode, path: '/path/to/bar_test.coffee', powerAssertVariableName: '_pa_'}),
            expression = espoweredAst.body[0],
            instrumentedCode = extractBodyOfAssertionAsCode(expression);
        //tap.note(instrumentedCode);
        return instrumentedCode;
    };
}();


q.test('assert.ok dog.speak() == says', function () {
    var dog = { speak: function () { return 'woof'; } },
        says = 'meow';
    _pa_.ok(eval(espowerCoffee('assert.ok dog.speak() == says')));
    q.assert.deepEqual(powerAssertTextLines, [
        '# /path/to/bar_test.coffee:1',
        '',
        'assert.ok dog.speak() == says',
        '          |   |       |  |   ',
        '          |   |       |  "meow"',
        '          {}  "woof"  false  ',
        ''
    ]);
});
