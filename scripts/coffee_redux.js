var espower = require('../lib/espower'),
    CoffeeScript = require('coffee-script-redux'),
    argv = require('optimist').argv,
    fs = require('fs'),
    file = argv._[0],
    path = fs.realpathSync(file),
    csCode = fs.readFileSync(file, 'utf-8');

var parseOptions = {raw: true};
var compileOptions = {bare: true};
var jsGenerateOptions = {compact: true};
var espowerOptions = {destructive: false, source: csCode, path: path, powerAssertVariableName: 'assert'};

var csAST = CoffeeScript.parse(csCode, parseOptions);
var jsAST = CoffeeScript.compile(csAST, compileOptions);
var espoweredAst = espower(jsAST, espowerOptions);
var jsCode = CoffeeScript.js(espoweredAst, jsGenerateOptions);

console.log(jsCode);
