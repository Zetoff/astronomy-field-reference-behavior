import _ from 'lodash';

import getIds from './get_ids';

/**
 * Sets the given references.
 *
 * @this {object} document
 * @param {string[]|object[]} idsOrDocs
 *  Array of ids or documents to be set
 * @function setReferences
 */

/**
 * Curries {@link setReferences} function for the given field name.
 *
 * @param {string} fieldName
 * @returns {setReferences}
 */
export default function currySetReferences(fieldName) {
  return function setReferences(idsOrDocs) {
    const doc = this;
    const ids = flow(
      _.castArray,
      getIds,
      _.compact
    )(idsOrDocs);

    doc[fieldName] = _.isEmpty(ids) ? undefined : ids;
  };
};
