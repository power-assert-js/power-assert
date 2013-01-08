/*jslint node:true */
var fs = require('fs'),
    gen = require('./lib/power-assert-gen'),
    file = process.argv[2];
var content = fs.readFileSync(file, 'utf-8');
gen(content);
