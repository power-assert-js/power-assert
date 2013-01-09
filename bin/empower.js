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
    fs = require('fs'),
    file = process.argv[2];
empower(fs.readFileSync(file, 'utf-8'), {module: 'CommonJS'});
