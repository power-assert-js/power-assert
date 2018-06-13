require('babel-register')({
    presets: [
        ['env', {
            targets: {
                node: "current",
                browsers: [
                    ">0.25%",
                    "not ie 11",
                    "not op_mini all"
                ]
            }
        }]
    ],
    only: /test\/tobe_instrumented/,
    plugins: [
        'transform-object-rest-spread',
        ['babel-plugin-espower', { embedAst: true }]
    ]
});
