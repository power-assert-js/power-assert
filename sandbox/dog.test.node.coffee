q = require 'qunitjs'
_pa_ = require('power-assert').useDefault();

class Dog
    speak: -> "woof"
    legs: 4

q.test "dog says woof", 1, (assert) ->
    dog = new Dog()
    says = "meow"
    assert.ok dog.speak() == says
	
q.test "dogs have four legs", 1, (assert) ->
    dog = new Dog()
    three = 3
    assert.ok dog.legs == three
