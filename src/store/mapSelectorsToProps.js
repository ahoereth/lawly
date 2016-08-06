export const mapSelectorsToProps = map => state => {
  return Object.keys(map).reduce((a, k) => ({...a, [k]: map[k](state) }), {});
};
