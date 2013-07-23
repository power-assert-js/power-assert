#!/bin/sh

./bin/empower sandbox/qunit_rhino.js > sandbox/qunit_rhino_empowered.js && java -jar js.jar sandbox/run_rhino.js
