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


var func = function () { return false; };
try {
    assert(func());
} catch (e) {
}


var obj = {
    age: function () {
        return 0;
    }
};
try {
    assert(obj.age());
} catch (e) {
}


var isFalsy = function (arg) {
    return !(arg);
};
var positiveInt = 50;
try {
    assert(isFalsy(positiveInt));
} catch (e) {
}


var sum = function () {
    var result = 0;
    for (var i = 0; i < arguments.length; i += 1) {
        result += arguments[i];
    }
    return result;
};
var one = 1, two = 2, three = 3, seven = 7;
try {
    assert(sum(one, two, three) === seven);
} catch (e) {
}
try {
    assert(sum(sum(one, two), three) === sum(sum(two, three), seven));
} catch (e) {
}
