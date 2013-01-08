/*jslint node:true */
var generate = require('./lib/power-assert-gen'),
    fs = require('fs'),
    file = process.argv[2];
generate(fs.readFileSync(file, 'utf-8'), {module: 'CommonJS'});
