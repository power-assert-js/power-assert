#!/bin/sh

node ./scripts/coffee_redux.js sandbox/dog.test.node.coffee > sandbox/dog.test.espowered.js && node sandbox/dog.test.espowered.js
exit 0
