#!/bin/sh

./bin/empower sandbox/qunit_rhino.js > sandbox/qunit_rhino_empowered.js && ./sandbox/phantomjs_test.sh
exit 0
