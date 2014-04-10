/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013-2014 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 */
var espower = require('espower'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    argv = require('optimist').argv,
    fs = require('fs'),
    options = {},
    file = argv._[0],
    path = fs.realpathSync(file),
    source = fs.readFileSync(file, 'utf-8'),
    tree = esprima.parse(source, {tolerant: true, loc: true, tokens: true, raw: true, source: path});

if (argv.powerAssertVariableName) {
  options['powerAssertVariableName'] = argv.powerAssertVariableName;
}
options['path'] = path;
options['source'] = source;
tree = espower(tree, options);
console.log(escodegen.generate(tree));
