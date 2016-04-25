module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'expect'],
        files: [
            { pattern: 'build/power-assert.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/tobe_instrumented/power_assert_test.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/tobe_instrumented/es6_test.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/not_tobe_instrumented/not_instrumented_test.js', watched: true, served: true, included: true }
        ],
        reporters: ['dots'],
        port: 9876,
        colors: true,
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        singleRun: true
    });
};
