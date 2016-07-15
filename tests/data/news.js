var Astro = require('meteor/jagi:astronomy');

module.exports = function() {
  it('populate data', function() {
    var News = Astro.Class.get('News');
    chai.expect(function() {
      News.insert({
        name: 'Without category',
      });
    }, 'without category').to.not.throw();
    chai.expect(function() {
      News.insert({
        name: 'Valid single category',
        categories: ['sport'],
      });
    }, 'valid single reference').to.not.throw();
    chai.expect(function() {
      News.insert({
        name: 'Valid multiple categories',
        categories: ['sport', 'international'],
      });
    }, 'valid multiple references').to.not.throw();
    chai.expect(function() {
      News.insert({
        name: 'Inalid single category',
        categories: ['invalid category'],
      });
    }, 'invalid single reference').to.throw();
    chai.expect(function() {
      News.insert({
        name: 'Inalid multiple categories',
        categories: ['sport', 'invalid category'],
      });
    }, 'invalid multiple references').to.throw();
  });
};
