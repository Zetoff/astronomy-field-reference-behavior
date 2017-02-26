import _ from 'lodash';
import { Validator } from 'meteor/jagi:astronomy';

import { REFERENCES_EXISTS_NAME } from '../constants';

const defaultValueQuery = refValue => refValue;

const getParams = (param) => {
  if (_.isPlainObject(param)) {
    return {
      referencedField: '_id',
      valueQuery: defaultValueQuery,
      ..._.pickBy(param),
    };
  } else {
    return { collection: param };
  }
};

export default Validator.create({
  name: REFERENCES_EXISTS_NAME,
  isValid({
    value,
    param,
  }) {
    const {
      collection,
      referencedField,
      valueQuery,
    } = getParams(param);

    const refValues = _.castArray(value);
    return _.every(refValues, (refValue) => {
      // store id. If document is not found _.every will stop and that
      // id will be available from resolveError method
      this.refValue = refValue;
      return collection.findOne({ [referencedField]: valueQuery(refValue) });
    });
  },
  resolveError({
    doc,
    name,
    param,
  }) {
    const {
      referencedField,
      valueQuery,
    } = getParams(param);
    return `Could not assign ${doc.constructor.getName()}.${name} because no ` +
      `document was found with field '${referencedField}' ${(
        valueQuery === defaultValueQuery
          ? `equal to '${this.refValue}'`
          : `matching '${JSON.stringify(valueQuery(this.refValue))}'`
      )}.`;
  },
});
