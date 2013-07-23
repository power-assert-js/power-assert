#!/bin/sh

node ./scripts/coffee_redux.js sandbox/mocha_node.coffee > sandbox/mocha_node.coffee.empowered.js && ./node_modules/.bin/mocha --reporter tap sandbox/mocha_node.coffee.empowered.js
exit 0
