#!/bin/sh

MOCHA=./node_modules/grunt-mocha-test/node_modules/.bin/mocha
node ./scripts/coffee_redux.js sandbox/mocha_node.coffee > sandbox/mocha_node.coffee.espowered.js && $MOCHA --reporter tap sandbox/mocha_node.coffee.espowered.js
exit 0
