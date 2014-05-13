require('espower-loader')({

    cwd: process.cwd(),
    pattern: 'test/tobe_instrumented/*_test.js',

    espowerOptions: {
        powerAssertVariableName: 'assert',
        targetMethods: {
            oneArg: [
                'ok'
            ],
            twoArgs: [
                'equal',
                'notEqual',
                'strictEqual',
                'notStrictEqual',
                'deepEqual',
                'notDeepEqual'
            ]
        }
    }
});
