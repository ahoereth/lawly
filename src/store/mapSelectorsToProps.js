import { mapValues } from 'lodash';

export default function mapSelectorsToProps(map) {
  return state => mapValues(map, sel => sel(state));
}
