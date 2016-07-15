var Astro = require('meteor/jagi:astronomy');

module.exports = function() {
  it('populate data', function() {
    var Category = Astro.Class.get('Category');
    chai.expect(function() {
      Category.insert({
        _id: 'international',
        name: 'International',
      });
    }, 'without parent category').to.not.throw();
    chai.expect(function() {
      Category.insert({
        _id: 'economy',
        name: 'Economy',
      });
    }, 'without parent category').to.not.throw();
    chai.expect(function() {
      Category.insert({
        _id: 'sport',
        name: 'Sport',
      });
    }, 'without parent category').to.not.throw();
    chai.expect(function() {
      Category.insert({
        _id: 'basketball',
        name: 'Basketball',
      });
    }, 'without parent category').to.not.throw();
    chai.expect(function() {
      Category.insert({
        _id: 'football',
        name: 'Football',
        parentCategory: ['sport'],
      });
    }, 'valid parent category').to.not.throw();
    chai.expect(function() {
      Category.insert({
        _id: 'tennis',
        name: 'Tennis',
        parentCategory: ['invalid category'],
      });
    }, 'invalid parent category').to.throw();
    chai.expect(function() {
      Category.insert({
        _id: 'tennis',
        name: 'Tennis',
        parentCategory: ['sport', 'invalid category'],
      });
    }, 'two parent categories').to.throw();
  });
};
