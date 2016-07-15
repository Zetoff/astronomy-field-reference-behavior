var chai = require('meteor/practicalmeteor:chai').chai;
var Astro = require('meteor/jagi:astronomy');

module.exports = function(className, behaviorName) {
  it('has behavior', function() {
    chai.assert.isDefined(Astro.Class.get(className).getBehavior(behaviorName));
  });
};