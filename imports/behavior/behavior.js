import { Class as AstroClass, Behavior, Validators } from 'meteor/jagi:astronomy';

export default Behavior.create({
  name: 'fieldReference',
  options: {
    fieldName: 'docRef',
    cacheName: null,
    getterName: null,
    optional: false,
    astroClass: null,
  },
  createClassDefinition() {

    this.prepareOptions();
    const {
      fieldName,
      cacheName,
      getterName,
      astroClass,
    } = this.options;

    // check(astroClass, AstroClass);

    return {
      fields: {
        [fieldName]: {
          type: String,
          optional: this.options.optional,
          validators: [{
            type: 'referenceExists',
            param: astroClass,
          }],
        },
        [cacheName]: {
          transient: true,
          type: Object,
        },
      },
      methods: {
        [getterName]() {
          const doc = this;
          if (doc[fieldName]) {
            this[cacheName] = astroClass.findOne({
              _id: doc[fieldName],
            });
          }
          return this[cacheName];
        },
      },
    };
  },
  apply(Class) {
    Class.extend(this.createClassDefinition(), [
      'fields',
      'validators',
      'methods'
    ]);
  },
  prepareOptions() {
    this._prepareCacheName();
    this._prepareGetterName();
    this._prepareAstroClass();
  },
  _prepareCacheName() {
    let { fieldName, cacheName } = this.options;
    if (!cacheName) {
      cacheName = `_${fieldName}`;
    }
    this.options.cacheName = cacheName;
  },
  _prepareGetterName() {
    let { fieldName, getterName } = this.options;
    if (!getterName) {
      getterName = `get` + fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }
    this.options.getterName = getterName;
  },
  _prepareAstroClass() {
    let { astroClass } = this.options;
    if (_.isString(astroClass)) {
      astroClass = AstroClass.get(astroClass);
    }
    this.options.astroClass = astroClass;
  },
});
