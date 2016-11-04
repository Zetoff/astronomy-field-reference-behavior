import { Class as AstroClass, Validator } from 'meteor/jagi:astronomy';

import * as Constants from '../constants';

export default Validator.create({
  name: Constants.REFERENCES_EXISTS_NAME,
  isValid({
    value: refIds,
    param: collection
  }) {
    if (!_.isArray(refIds)) {
      refIds = [refIds];
    }
    return _.every(refIds, (refId) => {
      // store id. If document is not found _.every will stop and that
      // id will be available from resolveError method
      this._refId = refId;
      return collection.findOne({
        _id: refId,
      });
    });
  },
  resolveError({
    doc,
    name,
  }) {
    return `Could not assign ${doc.constructor.getName()}.${name} ` +
      `because no document was found with id '${this._refId}'.`;
  }
});
