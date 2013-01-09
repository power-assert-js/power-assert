#!/bin/sh

./bin/empower.js sandbox/qunit_test.js > sandbox/qunit_test_empowered.js && node sandbox/qunit_test_empowered.js

./bin/empower.js sandbox/plain_node.js > sandbox/plain_node_empowered.js && node sandbox/plain_node_empowered.js
