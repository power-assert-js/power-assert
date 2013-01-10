#!/bin/sh

./bin/empower.js sandbox/qunit_rhino.js > sandbox/qunit_rhino_empowered.js && java -jar js.jar sandbox/run_rhino.js
./bin/empower.js --module=commonjs sandbox/qunit_node.js > sandbox/qunit_node_empowered.js && node sandbox/qunit_node_empowered.js
./bin/empower.js --module=commonjs sandbox/plain_node.js > sandbox/plain_node_empowered.js && node sandbox/plain_node_empowered.js
