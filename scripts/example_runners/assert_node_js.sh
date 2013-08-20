#!/bin/sh

echo '1..1'
node ./scripts/espower-cli.js sandbox/plain_node.js > sandbox/plain_node_espowered.js && node sandbox/plain_node_espowered.js
echo 'not ok 1'
