#!/bin/sh
DIR=$(cd $(dirname $0) && pwd)
URL=file://$DIR/coffee.html
phantomjs $DIR/run_qunit.js $URL
