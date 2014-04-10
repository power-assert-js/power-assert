load('bower_components/qunit/qunit/qunit.js');
load('bower_components/qunit-tap/lib/qunit-tap.js');
load('bower_components/estraverse/estraverse.js');
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

QUnit.config.autorun = false;

load('sandbox/qunit_rhino_espowered.js');

QUnit.load();
