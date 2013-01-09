#!/bin/sh

node bin/pagen.js sandbox/example.js > sandbox/example_pa.js && node sandbox/example_pa.js

node bin/pagen.js sandbox/plain_node.js > sandbox/plain_node_pa.js && node sandbox/plain_node_pa.js
