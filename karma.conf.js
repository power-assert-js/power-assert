module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'expect'],
        files: [
            { pattern: 'build/power-assert.js', watched: true, served: true, included: true },
            { pattern: 'test/tobe_instrumented/power_assert_test.js', watched: true, served: true, included: true },
            { pattern: 'test/tobe_instrumented/es6_test.js', watched: true, served: true, included: true },
            { pattern: 'test/not_tobe_instrumented/not_instrumented_test.js', watched: true, served: true, included: true }
        ],
        preprocessors: {
            'test/*/*.js': ['espower']
        },
        espowerPreprocessor: {
            options: {
                emitActualCode: false
            }
        },
        reporters: ['dots'],
        port: 9876,
        colors: true,
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        singleRun: true
    });
};
