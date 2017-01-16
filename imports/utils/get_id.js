import _ from 'lodash';

export default function getId(value) {
  return _.get(value, '_id', value);
};
