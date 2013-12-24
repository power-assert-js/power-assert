load('bower_components/qunit/qunit/qunit.js');
load('bower_components/qunit-tap/lib/qunit-tap.js');
load('bower_components/power-assert-formatter/lib/power-assert-formatter.js');
load('bower_components/empower/lib/empower.js');

(function () {
    qunitTap(QUnit, print, {
        showModuleNameOnFailure: true,
        showTestNameOnFailure: true,
        showExpectationOnFailure: true,
        showSourceOnFailure: false
    });
    empower(QUnit.assert, powerAssertFormatter(), {destructive: true});
})();

QUnit.init();
QUnit.config.updateRate = 0;

load('sandbox/qunit_rhino_espowered.js');

QUnit.start();
