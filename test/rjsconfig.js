var require = {
    paths: {
        "power-assert": "../build/power-assert",
        expect: "../bower_components/expect/index",
        mocha: "../bower_components/mocha/mocha",
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
