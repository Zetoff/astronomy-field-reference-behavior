import _ from 'lodash';

export default function inRefIds(refIds, queryIds) {
  return _.isEmpty(queryIds) ? refIds : _.intersection(refIds, queryIds);
};
