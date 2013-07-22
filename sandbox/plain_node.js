var assert = require('power-assert');

var hoge = 'foo';
var fuga = 'bar';
var piyo = hoge;
var falsyString = '';

try {
    assert(falsyString);
} catch (e) {
    console.log(e.message);
}

try {
    assert(fuga === piyo);
} catch (e) {
    console.log(e.message);
}

try {
    assert(hoge === fuga);
} catch (e) {
    console.log(e.message);
}

try {
    var piyo = 3;
    assert(fuga === piyo);
} catch (e) {
    console.log(e.message);
}

try {
    var longString = 'very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    var anotherLongString = 'yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message';
    assert(longString === anotherLongString);
} catch (e) {
    console.log(e.message);
}


var func = function () { return false; };
try {
    assert(func());
} catch (e) {
    console.log(e.message);
}


var obj = {
    age: function () {
        return 0;
    }
};
try {
    assert(obj.age());
} catch (e) {
    console.log(e.message);
}


var isFalsy = function (arg) {
    return !(arg);
};
var positiveInt = 50;
try {
    assert(isFalsy(positiveInt));
} catch (e) {
    console.log(e.message);
}


var sum = function () {
    var result = 0;
    for (var i = 0; i < arguments.length; i += 1) {
        result += arguments[i];
    }
    return result;
};
var one = 1, two = 2, three = 3, seven = 7, ten = 10;
try {
    assert(sum(one, two, three) === seven);
} catch (e) {
    console.log(e.message);
}
try {
    assert(sum(sum(one, two), three) === sum(sum(two, three), seven));
} catch (e) {
    console.log(e.message);
}
try {
    assert((three * (seven * ten)) === three);
} catch (e) {
    console.log(e.message);
}


var math = {
    calc: {
        sum: function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i += 1) {
                result += arguments[i];
            }
            return result;
        }
    }
};
try {
    assert(math.calc.sum(one, two, three) === seven);
} catch (e) {
    console.log(e.message);
}
