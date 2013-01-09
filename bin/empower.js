#!/usr/bin/env node

/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
var empower = require('../lib/empower'),
    argv = require('optimist').argv,
    fs = require('fs'),
    options = {};

if (argv.module) {
    options['module'] = argv.module;
}

var file = argv._[0];

empower(fs.readFileSync(file, 'utf-8'), options);
