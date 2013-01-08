/*jslint node:true */
var fs = require('fs'),
    passert = require('./lib/power-assert'),
    file = process.argv[2];
var content = fs.readFileSync(file, 'utf-8');
passert(content);
