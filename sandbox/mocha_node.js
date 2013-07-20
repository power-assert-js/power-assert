var assert = require("assert");
var _pa_ = require('power-assert').useDefault();

describe('Array', function(){
  before(function(){
    this.ary = [1,2,3];
  });
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      var zero = 0, two = 2;
      assert(this.ary.indexOf(zero) === two);
    });
    it('should return index when the value is present', function(){
      var minusOne = -1, two = 2;
      assert(this.ary.indexOf(two) === minusOne);
    });
  });
});
