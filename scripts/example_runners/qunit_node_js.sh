#!/bin/sh

node ./scripts/espower-cli.js sandbox/qunit_node.js > sandbox/qunit_node_espowered.js && node sandbox/qunit_node_espowered.js
