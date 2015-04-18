require("babel/register")({
    only: /test\/tobe_instrumented/,
    plugins: ['babel-plugin-espower'],
    extensions: ['.es6', '.js']
});
