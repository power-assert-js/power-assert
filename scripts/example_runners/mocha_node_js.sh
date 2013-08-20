#!/bin/sh

node ./scripts/espower-cli.js sandbox/mocha_node.js > sandbox/mocha_node_espowered.js && ./node_modules/.bin/mocha --reporter tap sandbox/mocha_node_espowered.js
exit 0
