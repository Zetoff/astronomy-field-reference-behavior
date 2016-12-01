import { chai } from 'meteor/practicalmeteor:chai';
import { Class as AstroClass } from 'meteor/jagi:astronomy';
import { behaviorName as fieldReference } from 'meteor/zetoff:astronomy-field-reference-behavior';

import { createCategory, createNews } from './tests/create_astro_class';
import { populateCategory, populateNews } from './tests/data';
import { createAstroClass, hasBehavior } from './tests/utils';

global.AstroClass = AstroClass;

describe('zetoff:astronomy-field-reference-behavior', function() {
  describe(`Category (single reference)`, function() {
    const className = `Category`;
    createAstroClass(createCategory);
    hasBehavior(className, fieldReference);
    populateCategory();
    describe('helpers', function() {
      it('set', function() {
        const basketball = AstroClass.get(className).findOne({_id: 'basketball'});
        chai.expect(basketball.setParentCategory).to.be.a('function');
        chai.expect(() => basketball.setParentCategory('sport')).to.not.throw();
        chai.expect(basketball.parentCategory).to.be.an('array');
        chai.assert.equal(basketball.parentCategory.length, 1);
        chai.expect(() => basketball.setParentCategory(['sport', 'international'])).to.not.throw();
        chai.expect(basketball.parentCategory).to.be.a('undefined');
        chai.expect(() => basketball.setParentCategory()).to.not.throw();
        chai.expect(basketball.parentCategory).to.be.a('undefined');
      });
      // TODO get
    });
  });

  describe(`News (multiple reference)`, function() {
    const className = `News`;
    createAstroClass(createNews);
    hasBehavior(className, fieldReference);
    populateNews();
    describe('helpers', function() {
      it('set', function() {
        const id = AstroClass.get(className).insert({name: 'Set test news'});
        const news = AstroClass.get(className).findOne({_id: id});
        chai.expect(news.setCategories).to.be.a('function');
        chai.expect(() => news.setCategories('sport')).to.not.throw();
        chai.expect(news.categories).to.be.an('array');
        chai.assert.equal(news.categories.length, 1);
        chai.expect(() => news.setCategories(['sport', 'international'])).to.not.throw();
        chai.expect(news.categories).to.be.an('array');
        chai.assert.equal(news.categories.length, 2);
        chai.expect(() => news.setCategories()).to.not.throw();
        chai.expect(news.categories).to.be.a('undefined');
      });
      // TODO get
      it('add', function() {
        const id = AstroClass.get(className).insert({
          name: 'Add test news',
        });
        const news = AstroClass.get(className).findOne({_id: id});
        chai.expect(news.addCategory, `add single helper`).to.be.a('function');
        chai.expect(news.addCategories, `add multiple helper`).to.be.a('function');
        chai.expect(() => news.addCategory('sport'), `add single category`).to.not.throw();
        chai.expect(news.categories, `when adding a first category the array should be created`).to.be.an('array');
        chai.assert.equal(news.categories.length, 1, `there should be only one category`);
        chai.expect(() => news.addCategory('sport'), `add existing category`).to.not.throw();
        chai.expect(news.categories).to.be.an('array');
        chai.assert.equal(news.categories.length, 1, `when adding existing category the array should not be modified`);
        chai.expect(() => news.addCategories(['international', 'economy']), `add multiple categories`).to.not.throw();
        chai.expect(news.categories).to.be.an('array');
        chai.assert.equal(news.categories.length, 3, `should have added two new categories to the existing one`);
      });
      it('remove', function() {
        const id = AstroClass.get(className).insert({
          name: 'Remove test news',
          categories: ['sport', 'international', 'economy'],
        });
        const news = AstroClass.get(className).findOne({_id: id});
        chai.expect(news.removeCategory, `remove single helper`).to.be.a('function');
        chai.expect(news.removeCategories, `remove multiple helper`).to.be.a('function');
        chai.expect(() => news.removeCategory('invalid category'), `remove single invalid category`).to.not.throw();
        chai.expect(news.categories, `remove helper should always result in array`).to.be.an('array');
        chai.assert.equal(news.categories.length, 3, `should have not removed any category`);
        chai.expect(() => news.removeCategory('sport'), `remove single category`).to.not.throw();
        chai.expect(news.categories, `remove helper should always result in array`).to.be.an('array');
        chai.assert.equal(news.categories.length, 2, `should have removed the category`);
        chai.expect(() => news.removeCategories(['international', 'economy']), `remove multiple categories`).to.not.throw();
        chai.expect(news.categories, `remove helper should always result in array`).to.be.an('array');
        chai.assert.equal(news.categories.length, 0, `there should be no categories left`);
      });
    });
  });
});