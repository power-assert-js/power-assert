#!/bin/sh

echo '##################################'
echo '##### qunit_node #################'
echo '##################################'
./bin/empower sandbox/qunit_node.js > sandbox/qunit_node_empowered.js && node sandbox/qunit_node_empowered.js

echo '##################################'
echo '##### plain_node #################'
echo '##################################'
./bin/empower sandbox/plain_node.js > sandbox/plain_node_empowered.js && node sandbox/plain_node_empowered.js

./bin/empower sandbox/qunit_rhino.js > sandbox/qunit_rhino_empowered.js

echo '##################################'
echo '##### phantomjs_test #############'
echo '##################################'
./sandbox/phantomjs_test.sh

echo '##################################'
echo '##### run_rhino ##################'
echo '##################################'
java -jar js.jar sandbox/run_rhino.js

echo '##################################'
echo '##### mocha_node #################'
echo '##################################'
./bin/empower sandbox/mocha_node.js > sandbox/mocha_node_empowered.js && ./node_modules/.bin/mocha sandbox/mocha_node_empowered.js
