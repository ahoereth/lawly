const mapSelectorsToProps = map => state => (
  Object.keys(map).reduce((a, k) => ({ ...a, [k]: map[k](state) }), {})
);

export default mapSelectorsToProps;
