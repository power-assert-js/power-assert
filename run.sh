#!/bin/sh

node bin/pagen.js sandbox/example.js > sandbox/gogo.js && node sandbox/gogo.js

node bin/pagen.js sandbox/plain_node.js > sandbox/hoho.js && node sandbox/hoho.js
