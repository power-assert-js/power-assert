#!/bin/sh

mocha --reporter tap --require './sandbox/loader' sandbox/mocha_node.js

exit 0
