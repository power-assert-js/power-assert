#!/bin/sh

echo '##################################'
echo '##### mocha_node #################'
echo '##################################'
./bin/empower sandbox/mocha_node.js > sandbox/mocha_node_empowered.js && ./node_modules/.bin/mocha --reporter min sandbox/mocha_node_empowered.js
