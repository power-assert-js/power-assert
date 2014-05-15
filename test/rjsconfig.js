var require = {
    paths: {
        "power-assert": "../build/power-assert",
        expect: "../bower_components/expect/index",
        "power-assert-formatter": "../bower_components/power-assert-formatter/lib/power-assert-formatter",
        "qunit-tap": "../bower_components/qunit-tap/lib/qunit-tap",
        qunit: "../bower_components/qunit/qunit/qunit",
        mocha: "../bower_components/mocha/mocha",
        empower: "../bower_components/empower/lib/empower",
        esprima: "../bower_components/esprima/esprima",
        requirejs: "../bower_components/requirejs/require"
    },
    shim: {
        "power-assert": {
            exports: "assert"
        },
        expect: {
            exports: "expect"
        }
    }
};
