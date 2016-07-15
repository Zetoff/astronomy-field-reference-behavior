var Mongo = require('meteor/mongo').Mongo;
var Astro = require('meteor/jagi:astronomy');

module.exports = function() {
  return Astro.Class.create({
    name: 'Category',
    secured: true,
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
        singularName: 'parentCategory',
        optional: true,
        astroClass: 'Category',
      }],
    },
  });
};
