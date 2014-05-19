/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013-2014 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 */
var espowerSourceToSource = require('espower-source'),
    argv = require('optimist').argv,
    fs = require('fs'),
    options = {},
    file = argv._[0],
    path = fs.realpathSync(file),
    code = fs.readFileSync(file, 'utf-8');

if (argv.powerAssertVariableName) {
    options['powerAssertVariableName'] = argv.powerAssertVariableName;
}
console.log(espowerSourceToSource(code, path, options));
