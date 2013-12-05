#!/bin/sh

MOCHA=./node_modules/grunt-mocha-test/node_modules/.bin/mocha
node ./scripts/espower-cli.js sandbox/mocha_node.js > sandbox/mocha_node_espowered.js && $MOCHA --reporter tap sandbox/mocha_node_espowered.js
exit 0
