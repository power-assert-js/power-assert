#!/bin/sh

echo '1..1'
./bin/empower sandbox/plain_node.js > sandbox/plain_node_empowered.js && node sandbox/plain_node_empowered.js
echo 'not ok 1'
