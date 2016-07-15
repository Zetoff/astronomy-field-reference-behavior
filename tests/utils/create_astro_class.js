var chai = require('meteor/practicalmeteor:chai').chai;

module.exports = function(createCallback) {
  it('create', function() {
    chai.expect(createCallback).to.not.throw();
  });
}