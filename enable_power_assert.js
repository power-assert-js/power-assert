require('babel-register')({
    only: /test\/tobe_instrumented/,
    plugins: [
        ['babel-plugin-espower', { "embedAst": true }]
    ],
    extensions: ['.es6', '.js']
});
