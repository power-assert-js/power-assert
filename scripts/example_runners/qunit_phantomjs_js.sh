#!/bin/sh

node ./scripts/espower-cli.js sandbox/qunit_rhino.js > sandbox/qunit_rhino_espowered.js && ./sandbox/phantomjs_test.sh
exit 0
