load('lib/power-assert-core.js');
load('lib/power-assert-api.js');
load('lib/power-assert-capturing.js');
load('lib/power-assert-formatter.js');
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

load('sandbox/qunit_rhino_empowered.js');

QUnit.start();
