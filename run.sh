#!/bin/sh

node bin/pagen.js test/example.js > test/gogo.js && node test/gogo.js

node bin/pagen.js test/plain_node.js > test/hoho.js && node test/hoho.js
