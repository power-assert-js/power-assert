assert = require '../lib/power-assert'

describe 'Array', ->  

    beforeEach ->
        this.ary = [1,2,3]

    describe '#indexOf()', ->  

        it 'should return -1 when the value is not present', ->  
            zero = 0
            two = 2
            assert this.ary.indexOf(zero) == two

        it 'should return index when the value is present', ->  
            minusOne = -1
            two = 2
            assert.ok this.ary.indexOf(two) == minusOne, 'THIS IS AN ASSERTION MESSAGE'
