var Mongo = require('meteor/mongo').Mongo;
var Astro = require('meteor/jagi:astronomy');

module.exports = function() {
  return Astro.Class.create({
    name: 'News',
    secured: false,
    collection: new Mongo.Collection(null),
    fields: {
      name: {
        type: String,
      },
      description: {
        type: String,
        optional: true,
      },
    },
    behaviors: {
      fieldReference: [{
        singularName: 'category',
        pluralName: 'categories',
        multiple: true,
        optional: true,
        astroClass: 'Category',
      }],
    },
  });
};
