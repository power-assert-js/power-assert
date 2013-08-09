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
        define(['assert', './module'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('assert'), require('./module'));
    } else {
        root.assert = factory(root.assert, root.empower);
    }
}(this, function (baseAssert, empower) {
    'use strict';

    return empower(baseAssert);
}));
