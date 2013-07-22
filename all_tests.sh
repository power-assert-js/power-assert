#!/bin/sh

rm empowered_tests/*

for i in $(find mocha_tests -name '*_test.js' -type f)
do
    FILENAME=$(basename $i)
    ./bin/empower $i > empowered_tests/$FILENAME
done

prove --exec='./node_modules/.bin/mocha --reporter tap' empowered_tests/*
prove --exec=node test/*
