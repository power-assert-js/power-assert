#!/bin/sh

./bin/empower.js sandbox/qunit_test_rhino.js > sandbox/qunit_test_rhino_empowered.js && java -jar js.jar rhino.js
./bin/empower.js sandbox/qunit_test.js --node > sandbox/qunit_test_empowered.js && node sandbox/qunit_test_empowered.js
# ./bin/empower.js sandbox/plain_node.js --node > sandbox/plain_node_empowered.js && node sandbox/plain_node_empowered.js
