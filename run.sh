#!/bin/sh

./bin/pagenerate.js sandbox/example.js > sandbox/example_pa.js && node sandbox/example_pa.js

./bin/pagenerate.js sandbox/plain_node.js > sandbox/plain_node_pa.js && node sandbox/plain_node_pa.js
