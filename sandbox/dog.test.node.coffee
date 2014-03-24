q = require 'qunitjs'
empower = require 'empower'
formatter = require 'power-assert-formatter'
qunitTap = require 'qunit-tap'
empower(q.assert, formatter(), {destructive: true})
qunitTap(q, require('util').puts, {showSourceOnFailure: false})
q.config.autorun = false

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

q.load()
