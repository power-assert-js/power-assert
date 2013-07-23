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
./bin/empower sandbox/mocha_node.js > sandbox/mocha_node_empowered.js && ./node_modules/.bin/mocha --reporter tap sandbox/mocha_node_empowered.js


echo '##################################'
echo '##### coffee script redux ########'
echo '##################################'
node ./scripts/coffee_redux.js sandbox/dog.test.coffee > sandbox/dog.test.empowered.js && ./sandbox/phantomjs_coffee.sh

echo '#######################################'
echo '##### coffee script redux Node ########'
echo '#######################################'
node ./scripts/coffee_redux.js sandbox/dog.test.node.coffee > sandbox/dog.test.node.empowered.js && node sandbox/dog.test.node.empowered.js

echo '###############################################'
echo '##### coffee script redux Node & Mocha ########'
echo '###############################################'
node ./scripts/coffee_redux.js sandbox/mocha_node.coffee > sandbox/mocha_node.coffee.empowered.js && ./node_modules/.bin/mocha --reporter tap sandbox/mocha_node.coffee.empowered.js
