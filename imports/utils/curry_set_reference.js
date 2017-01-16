import _ from 'lodash';

import currySetReferences from './curry_set_references';

/**
 * Sets the given reference.
 *
 * @this {object} document
 * @param {string|object} idOrDoc
 *  Id or document to be set
 * @function setReference
 */

/**
 * Curries {@link setReference} function for the given field name.
 *
 * @param {string} fieldName
 * @returns {setReference}
 */
export default function currySetReference(fieldName) {
  const setReferences = currySetReferences(fieldName);
  return function setReference(idOrDoc) {
    setReferences.call(this, _.isArray(idOrDoc) ? _.head(idOrDoc) : idOrDoc);
  };
};
