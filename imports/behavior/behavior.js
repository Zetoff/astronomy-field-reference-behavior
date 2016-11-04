import { check, Match } from 'meteor/check';
import { Class as AstroClass, Behavior, Validators } from 'meteor/jagi:astronomy';

import * as Constants from '../constants';

function getReferencedDocument(collection, refId) {
  return collection.findOne({
    _id: refId,
  });
}

Behavior.create({
  name: Constants.BEHAVIOR_NAME,
  options: {
    singularName: 'docRef',
    pluralName: 'docRefs',
    fieldName: null,
    getSingleMethod: null,
    getMultipleMethod: null,
    setMethod: null,
    addSingleMethod: null,
    addMultipleMethod: null,
    removeSingleMethod: null,
    removeMultipleMethod: null,
    optional: false,
    multiple: false,
    unique: true,
    collection: null,
    validators: null,
  },
  createClassDefinition() {
    this.beforePrepareOptions();
    this.prepareOptions();
    this.afterPrepareOptions();

    const {
      fieldName,
      getSingleMethod,
      getMultipleMethod,
      setMethod,
      addSingleMethod,
      addMultipleMethod,
      removeSingleMethod,
      removeMultipleMethod,
      collection,
      multiple,
      unique,
      validators,
    } = this.options;

    const definition = {
      fields: {
        [fieldName]: {
          type: [String],
          optional: this.options.optional,
          validators: validators,
        },
      },
      methods: {},
      events: {
        beforeSave(e) {
          const { currentTarget: doc} = e;
          if (unique) {
            // remove repeated in case they have been pushed
            // directly into the array
            doc[fieldName] = _.uniq(doc[fieldName]);
          }
        }
      }
    };

    if (multiple) {
      // add methods
      Object.assign(definition.methods, {
        [setMethod](ids) {
          const doc = this;
          if (!_.isArray(ids)) {
            ids = ids ? [ids] : undefined;
          }
          if (_.isArray(ids)) {
            ids = _.map(ids, (id) => {
              return _.isObject(id) ? id._id : id;
            });
          }
          doc[fieldName] = ids;
        },
        [getSingleMethod](id) {
          check(id, String);
          return getReferencedDocument(collection, id);
        },
        [getMultipleMethod](ids) {
          const doc = this;
          if (ids) {
            if (!_.isArray(ids)) {
              ids = [ids];
            }
          }
          return collection.find({
            _id: {
              '$in': (ids ? ids : doc[fieldName])
            }
          });
        },
        [addSingleMethod](id) {
          const doc = this;
          if (_.isObject(id)) {
            id = id._id;
          }
          if (unique && _.includes(doc[fieldName], id)) {
            // do not add
          } else {
            if (!_.isArray(doc[fieldName])) {
              doc[fieldName] = [];
            }
            doc[fieldName].push(id);
          }
        },
        [addMultipleMethod](ids) {
          const doc = this;
          if (!_.isArray(ids)) {
            ids = [ids];
          }
          _.forEach(ids, doc[addSingleMethod].bind(doc));
        },
        [removeSingleMethod](id) {
          const doc = this;
          if (_.isObject(id)) {
            id = id._id;
          }
          if (doc[fieldName]) {
            doc[fieldName] = _.filter(doc[fieldName], (refId) => {
              return refId !== id;
            });
          }
        },
        [removeMultipleMethod](ids) {
          const doc = this;
          if (!_.isArray(ids)) {
            ids = [ids];
          }
          _.forEach(ids, doc[removeSingleMethod].bind(doc));
        },
      });
    } else {
      // add methods
      Object.assign(definition.methods, {
        [setMethod](id) {
          const doc = this;
          if (_.isObject(id)) {
            id = id._id;
          }
          doc[fieldName] = id ? [id] : undefined;
        },
        [getSingleMethod]() {
          const doc = this;
          return getReferencedDocument(collection, _.head(doc[fieldName]));
        },
      })
    }

    return definition;
  },
  apply(Class) {
    Class.extend(this.createClassDefinition(), [
      'fields',
      'validators',
      'methods',
      'events'
    ]);
  },
  beforePrepareOptions() {
    check(this.options.multiple, Boolean);
    check(this.options.optional, Boolean);
    check(this.options.unique, Boolean);
    check(this.options.singularName, String);
    if (this.options.multiple) {
      check(this.options.pluralName, String);
    }
    if (this.options.astroClass) {
      console.warn(`astronomy-field-reference-behavior: 'astroClass' option is deprecated, use 'collection' instead`);
      this.options.collection = this.options.astroClass;
    }
  },
  afterPrepareOptions() {
    check(this.options.validators, Array);
  },
  prepareOptions() {
    const { singularName, pluralName, multiple } = this.options;
    this._prepareName('fieldName', multiple ? pluralName : singularName);
    this._prepareMethodName('setMethod', 'set', multiple ? pluralName : singularName);
    this._prepareMethodName('getSingleMethod', 'get', singularName);
    this._prepareMethodName('getMultipleMethod', 'get', pluralName);
    this._prepareMethodName('addSingleMethod', 'add', singularName);
    this._prepareMethodName('addMultipleMethod', 'add', pluralName);
    this._prepareMethodName('removeSingleMethod', 'remove', singularName);
    this._prepareMethodName('removeMultipleMethod', 'remove', pluralName);
    this._prepareAstroClass();
    this._prepareValidators();
  },
  _prepareAstroClass() {
    let { collection } = this.options;
    if (_.isString(collection)) {
      collection = AstroClass.get(collection);
    }
    this.options.collection = collection;
  },
  _prepareValidators() {
    if (!_.isArray(this.options.validators)) {
      this.options.validators = [];
    }
    const { multiple, validators, collection } = this.options;
    validators.unshift({
      type: Constants.REFERENCES_EXISTS_NAME,
      param: collection,
    });
    if (!multiple) {
      validators.unshift({
        type: 'maxLength',
        param: 1,
      });
    }
  },
  _prepareName(optionName, prefix, suffix = '') {
    if (!_.isString(this.options[optionName])) {
      this.options[optionName] = prefix + suffix;
    }
  },
  _prepareMethodName(optionName, prefix, suffix = '') {
    this._prepareName(optionName, prefix, this._capitalize(suffix));
  },
  _capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
});
