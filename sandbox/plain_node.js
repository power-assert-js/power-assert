var assert = require('assert');

var hoge = 'foo';
var fuga = 'bar';
var piyo = hoge;
var falsyString = '';

try {
    assert(falsyString);
} catch (e) {
}

try {
    console.assert(falsyString);
} catch (e) {
}

try {
    assert(fuga === piyo);
} catch (e) {
}

try {
    assert(hoge === fuga);
} catch (e) {
}

try {
    var piyo = 3;
    assert(fuga === piyo);
} catch (e) {
}

try {
    var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    assert(longString === anotherLongString);
} catch (e) {
}
