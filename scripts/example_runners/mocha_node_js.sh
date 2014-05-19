#!/bin/sh

MOCHA=./node_modules/.bin/mocha
$MOCHA --reporter tap --require './sandbox/loader' sandbox/mocha_node.js

exit 0
