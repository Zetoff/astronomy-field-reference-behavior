import { Class as AstroClass, Validator } from 'meteor/jagi:astronomy';

import * as Constants from '../constants';

export default Validator.create({
  name: Constants.REFERENCES_EXISTS_NAME,
  parseParam(param) {
    if (!AstroClass.isParentOf(param)) {
      throw new TypeError(`'${Constants.REFERENCES_EXISTS_NAME}.param' must `+
        `be a valid Astro.Class.`);
    }
  },
  isValid({
    value: refIds,
    param: astroClass
  }) {
    if (!_.isArray(refIds)) {
      refIds = [refIds];
    }
    return _.every(refIds, (refId) => {
      // store id. If document is not found _.every will stop and that
      // id will be available from resolveError method
      this._refId = refId;
      return astroClass.findOne({
        _id: refId,
      });
    });
  },
  resolveError({
    doc,
    name,
    param: astroClass,
  }) {
    return `Could not assign ${doc.constructor.getName()}.${name} ` +
      `because no ${astroClass.getName()} was found with id '${this._refId}'.`;
  }
});
