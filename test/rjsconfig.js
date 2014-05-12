var require = {
    paths: {
        assert: "../bower_components/assert/assert",
        "es5-shim": "../bower_components/es5-shim/es5-shim",
        expect: "../bower_components/expect/index",
        "power-assert-formatter": "../bower_components/power-assert-formatter/lib/power-assert-formatter",
        "qunit-tap": "../bower_components/qunit-tap/lib/qunit-tap",
        qunit: "../bower_components/qunit/qunit/qunit",
        mocha: "../bower_components/mocha/mocha",
        empower: "../bower_components/empower/lib/empower",
        esprima: "../bower_components/esprima/esprima",
        estraverse: "../bower_components/estraverse/estraverse",
        requirejs: "../bower_components/requirejs/require",
        diff_match_patch: "../bower_components/google-diff-match-patch-js/diff_match_patch"
    },
    shim: {
        assert: {
            exports: "assert"
        },
        diff_match_patch: {
            exports: "diff_match_patch"
        },
        expect: {
            exports: "expect"
        }
    }
};
