#!/bin/sh

mkdir -p espowered_tests
rm espowered_tests/*

for i in $(find mocha_tests -name '*_test.js' -type f)
do
    FILENAME=$(basename $i)
    ./bin/espower $i > espowered_tests/$FILENAME
done

prove --exec='./node_modules/.bin/mocha --reporter tap' espowered_tests/*
prove --exec=node test/*
