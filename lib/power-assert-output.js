/**
 * power-assert.js - Empower your assertions
 *
 * https://github.com/twada/power-assert.js
 *
 * Copyright (c) 2013 Takuto Wada
 * Licensed under the MIT license.
 *   https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt
 */
(function (root, factory) {
    'use strict';

    if (typeof exports !== 'undefined') {
        var api = require('./power-assert-api');
        factory(exports, api);
    } else {
        factory(root._pa_, root._pa_);
    }

}(this, function (exports, api) {
    'use strict';

    api.puts = function() {
        console.log.apply(console, arguments);
    };

    api.dump = function (obj) {
        if (typeof obj === 'string') {
            return '"' + obj + '"';
        } else {
            return String(obj);
        }
    };
}));
