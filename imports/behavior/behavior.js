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
    getSingleHelper: null,
    getMultipleHelper: null,
    setHelper: null,
    addSingleHelper: null,
    addMultipleHelper: null,
    removeSingleHelper: null,
    removeMultipleHelper: null,
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
          cast(value) {
            // wrap into an array
            return _.isArray(value) ? value : [ value ];
          },
        },
      },
      helpers: {},
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
      Object.assign(definition.helpers, this.getMultipleHelpersDefinition());
    } else {
      Object.assign(definition.helpers, this.getSingleHelpersDefinition())
    }

    return definition;
  },
  apply(Class) {
    Class.extend(this.createClassDefinition(), [
      'fields',
      'validators',
      'helpers',
      'events',
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
    this._prepareHelperName('setHelper', 'set', multiple ? pluralName : singularName);
    this._prepareHelperName('getSingleHelper', 'get', singularName);
    this._prepareHelperName('getMultipleHelper', 'get', pluralName);
    this._prepareHelperName('addSingleHelper', 'add', singularName);
    this._prepareHelperName('addMultipleHelper', 'add', pluralName);
    this._prepareHelperName('removeSingleHelper', 'remove', singularName);
    this._prepareHelperName('removeMultipleHelper', 'remove', pluralName);
    this._prepareAstroClass();
    this._prepareValidators();
  },
  getMultipleHelpersDefinition() {
    const {
      fieldName,
      getSingleHelper,
      getMultipleHelper,
      setHelper,
      addSingleHelper,
      addMultipleHelper,
      removeSingleHelper,
      removeMultipleHelper,
      collection,
      unique,
    } = this.options;

    return {
      [setHelper](ids) {
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
      [getSingleHelper](id) {
        check(id, String);
        return getReferencedDocument(collection, id);
      },
      [getMultipleHelper](ids) {
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
      [addSingleHelper](id) {
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
      [addMultipleHelper](ids) {
        const doc = this;
        if (!_.isArray(ids)) {
          ids = [ids];
        }
        _.forEach(ids, doc[addSingleHelper].bind(doc));
      },
      [removeSingleHelper](id) {
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
      [removeMultipleHelper](ids) {
        const doc = this;
        if (!_.isArray(ids)) {
          ids = [ids];
        }
        _.forEach(ids, doc[removeSingleHelper].bind(doc));
      },
    }
  },
  getSingleHelpersDefinition() {
    const {
      fieldName,
      getSingleHelper,
      setHelper,
      collection,
    } = this.options;

    return {
      [setHelper](id) {
        const doc = this;
        if (_.isObject(id)) {
          id = id._id;
        }
        doc[fieldName] = id ? [id] : undefined;
      },
      [getSingleHelper]() {
        const doc = this;
        return getReferencedDocument(collection, _.head(doc[fieldName]));
      },
    };
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
    const {
      multiple,
      optional,
      validators,
      collection,
    } = this.options;

    validators.unshift({
      type: Constants.REFERENCES_EXISTS_NAME,
      param: collection,
    });
    if (!optional) {
      validators.unshift({
        type: 'minLength',
        param: 1,
      });
    }
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
  _prepareHelperName(optionName, prefix, suffix = '') {
    this._prepareName(optionName, prefix, this._capitalize(suffix));
  },
  _capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
});
