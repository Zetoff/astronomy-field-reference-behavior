import _ from 'lodash';

import inRefIds from './in_ref_ids';

/**
 * Gets referenced documents in the field from their collection.
 *
 * @param {string|string[]} queryIds
 *  Optional, allows to specify a list of id in order to only retrieve a subset
 *  of the referenced documents
 * @return {Cursor}
 *  Result of collection.find()
 * @function getReferencedDocuments
 */

/**
 * Curries {@link getReferencedDocuments} for the given field name and
 * collection.
 *
 * @param {string} fieldName
 * @param {*} collection
 *  Collection where the documents being referenced are stored
 * @returns {getReferencedDocuments}
 */
export default function curryGetReferencedDocuments(fieldName, collection) {
  return function getReferencedDocuments(queryIds = []) {
    const doc = this;
    const refIds = _.get(doc, fieldName, []);

    queryIds = _.flow([
      _.castArray,
      _.compact,
      _.curry(inRefIds)(refIds)
    ])(queryIds);

    return collection.find({
      _id: { $in: queryIds },
    });
  };
};
