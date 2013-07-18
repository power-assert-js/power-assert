var empower = require('../lib/empower'),
    CoffeeScript = require('coffee-script-redux'),
    q = require('qunitjs'),
    util = require('util'),
    tap = (function (qu) {
        var qunitTap = require("qunit-tap").qunitTap;
        var tap = qunitTap(qu, util.puts, {showSourceOnFailure: false});
        qu.init();
        qu.config.updateRate = 0;
        return tap;
    })(q);


q.test('with CoffeeScriptRedux toolchain', function (assert) {
    var csCode = 'assert.ok dog.legs == three';

    var parseOptions = {raw: true};
    var csAST = CoffeeScript.parse(csCode, parseOptions);

    var compileOptions = {bare: false};
    var jsAST = CoffeeScript.compile(csAST, compileOptions);

    assert.ok(jsAST);

    //console.log(JSON.stringify(jsAST, null, 4));
    var empoweredAst = empower(jsAST, {destructive: false, source: csCode});

    var jsGenerateOptions = {compact: true};
    var jsCode = CoffeeScript.js(empoweredAst, jsGenerateOptions);
    assert.equal(jsCode, "assert.ok(_pa_.expr(_pa_.binary(_pa_.ident(_pa_.ident(dog,{start:{line:1,column:11}}).legs,{start:{line:1,column:14}})===_pa_.ident(three,{start:{line:1,column:23}}),{start:{line:1,column:20}}),{start:{line:1,column:11}},'assert.ok dog.legs == three'))");
});
