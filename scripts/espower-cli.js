/**
 * espower-cli.js
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013-2014 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/power-assert/blob/master/MIT-LICENSE.txt
 */
var espowerSource = require('espower-source'),
    fs = require('fs'),
    file = process.argv[2],
    path = fs.realpathSync(file),
    code = fs.readFileSync(file, 'utf-8');

console.log(espowerSource(code, path));
