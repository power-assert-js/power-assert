describe('power-assert modules', function () {
    if (typeof window === 'undefined') return;

    it('global', function () {
        assert(true);
    });

    it('amd', function (done) {
        var iframe = document.createElement('iframe');
        iframe.src = '/base/test/fixture/amd.html';
        document.body.appendChild(iframe);

        iframe.onload = function () {
            var require = iframe.contentWindow.require;
            require([
                "power-assert"
            ], function (assert) {
                assert(true);
                done();
            });
        };
    });

});
