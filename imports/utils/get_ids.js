import _ from 'lodash';
import {
  flow,
  map,
} from 'lodash/fp';

import getId from './get_id';

function getIds(valueOrValues) {
  return _.flow(
    _.castArray,
    map(getId)
  )(valueOrValues);
}

export default getIds;
