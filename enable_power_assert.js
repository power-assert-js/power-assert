var babelOptions = {
    babelrc: false,
    cache: false,
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: "current",
                browsers: [
                    ">0.25%",
                    "not ie 11",
                    "not op_mini all"
                ]
            },
        }]
    ],
    only: [/test\/tobe_instrumented/],
    plugins: [
        // set `embedAst` to `false` to test embedded parser
        ['babel-plugin-espower', { embedAst: false }]
    ]
};

require('@babel/register')(babelOptions);
