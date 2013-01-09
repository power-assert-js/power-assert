#!/usr/bin/env node

var empower = require('../lib/empower'),
    fs = require('fs'),
    file = process.argv[2];
empower(fs.readFileSync(file, 'utf-8'), {module: 'CommonJS'});
