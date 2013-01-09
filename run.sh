#!/bin/sh

./bin/empower.js sandbox/example.js > sandbox/example_pa.js && node sandbox/example_pa.js

./bin/empower.js sandbox/plain_node.js > sandbox/plain_node_pa.js && node sandbox/plain_node_pa.js
