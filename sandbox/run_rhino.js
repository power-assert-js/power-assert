load('node_modules/qunitjs/qunit/qunit.js');
load('node_modules/qunit-tap/lib/qunit-tap.js');
load('lib/power-assert-formatter-compact.js');
load('lib/power-assert-qunit.js');

(function () {
    qunitTap(QUnit, print, {
        showModuleNameOnFailure: true,
        showTestNameOnFailure: true,
        showExpectationOnFailure: true,
        showSourceOnFailure: false
    });
    empowerQUnit(QUnit);
})();

QUnit.init();
QUnit.config.updateRate = 0;

load('sandbox/qunit_rhino_empowered.js');

QUnit.start();
