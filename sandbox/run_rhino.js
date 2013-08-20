load('node_modules/qunitjs/qunit/qunit.js');
load('node_modules/qunit-tap/lib/qunit-tap.js');
load('node_modules/empower/lib/power-assert-formatter.js');
load('node_modules/empower/lib/empower.js');

(function () {
    qunitTap(QUnit, print, {
        showModuleNameOnFailure: true,
        showTestNameOnFailure: true,
        showExpectationOnFailure: true,
        showSourceOnFailure: false
    });
    empower(QUnit.assert, {destructive: true});
})();

QUnit.init();
QUnit.config.updateRate = 0;

load('sandbox/qunit_rhino_espowered.js');

QUnit.start();
