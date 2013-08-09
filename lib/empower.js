/**
 * power-assert - Empower your assertions
 *
 * https://github.com/twada/power-assert
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert/master/MIT-LICENSE.txt
 */
(function (root, factory) {
    'use strict';

    // using returnExports UMD pattern
    if (typeof define === 'function' && define.amd) {
        define(['./power-assert-function', './power-assert-object'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('./power-assert-function'), require('./power-assert-object'));
    } else {
        root.empower = factory(root.empowerAssertFunction, root.empowerAssertObject);
    }
}(this, function (empowerAssertFunction, empowerAssertObject) {
    'use strict';

    function empower (assert, options) {
        switch (typeof assert) {
        case 'function':
            return empowerAssertFunction(assert, options);
        case 'object':
            return empowerAssertObject(assert, options);
        default:
            throw new Error('Cannot be here');
        }
    }

    return empower;
}));
