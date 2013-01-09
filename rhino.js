load('lib/power-assert.js');
load('node_modules/qunitjs/qunit/qunit.js');
load('node_modules/qunit-tap/lib/qunit-tap.js');

(function () {
    qunitTap(QUnit, print, {
        showModuleNameOnFailure: true,
        showTestNameOnFailure: true,
        showExpectationOnFailure: true,
        showSourceOnFailure: false
    });

    _pa_.puts = print;
})();

QUnit.init();
QUnit.config.updateRate = 0;

load('sandbox/qunit_test_empowered_rhino.js');

QUnit.start();
