#!/bin/sh

espower sandbox/qunit_rhino.js > sandbox/qunit_rhino_espowered.js && java -jar js.jar sandbox/run_rhino.js
