import _ from 'lodash';

import curryGetReferencedDocuments from './curry_get_referenced_docs';

/**
 * Gets referenced document in the field from their collection. If the query
 * results in more than one document, only the first one is returned.
 *
 * @param {string|string[]} queryIds
 *  Optional, allows to specify a list of id in order to only retrieve a subset
 *  of the referenced documents
 * @return {object}
 *  Referenced document
 * @function getReferencedDocument
 */

/**
 * Curries {@link getReferencedDocument} for the given field name and
 * collection.
 *
 * @param {string} fieldName
 * @param {*} collection
 *  Collection where the documents being referenced are stored
 * @returns {getReferencedDocument}
 */
export default function curryGetReferencedDocument(collection, fieldName) {
  const getReferencedDocuments = curryGetReferencedDocuments(collection, fieldName);
  return function getReferencedDocument(queryIds) {
    return _.head(getReferencedDocuments.call(this, queryIds).fetch());
  };
};
