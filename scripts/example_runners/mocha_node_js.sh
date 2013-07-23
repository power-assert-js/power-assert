#!/bin/sh

./bin/empower sandbox/mocha_node.js > sandbox/mocha_node_empowered.js && ./node_modules/.bin/mocha --reporter tap sandbox/mocha_node_empowered.js
exit 0
