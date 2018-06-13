module.exports = function (config) {
    config.set({
        basePath: '',
        client: {
            useIframe: false
        },
        frameworks: ['mocha', 'expect'],
        files: [
            { pattern: 'node_modules/requirejs/require.js', included: false },
            { pattern: 'test/fixture/amd.html', watched: true, served: true, included: false },
            { pattern: 'build/power-assert.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/tobe_instrumented/assertion.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/tobe_instrumented/assertion.es20xx.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/tobe_instrumented/customization.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/tobe_instrumented/strict_mode.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/not_tobe_instrumented/not_instrumented.js', watched: true, served: true, included: true },
            { pattern: 'espowered_tests/tobe_instrumented/modules.js', watched: true, served: true, included: true }
        ],
        reporters: ['dots'],
        port: 9876,
        colors: true,
        browsers: ['Chrome', 'Firefox'],
        singleRun: true
    });
};
