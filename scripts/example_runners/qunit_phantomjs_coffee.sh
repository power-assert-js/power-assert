#!/bin/sh

node ./scripts/coffee_redux.js sandbox/dog.test.coffee > sandbox/dog.test.empowered.js && ./sandbox/phantomjs_coffee.sh
exit 0
