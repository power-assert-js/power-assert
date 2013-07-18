class Dog
    speak: -> "woof"
    legs: 4

test "dog says woof", 1, (assert) ->
    dog = new Dog()
    says = "meow"
    assert.ok dog.speak() == says
	
test "dogs have four legs", 1, (assert) ->
    dog = new Dog()
    three = 3
    assert.ok dog.legs == three
