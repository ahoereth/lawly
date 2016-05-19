import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { fetchLaw, getLaws } from 'redux/modules/laws';
import { getUserLaws, star } from 'redux/modules/user';
import { Law } from 'components';


class LawContainer extends React.Component {
  static propTypes = {
    annotations: ImmutablePropTypes.map.isRequired,
    fetch: PropTypes.func.isRequired,
    norms: ImmutablePropTypes.list.isRequired,
    params: PropTypes.shape({
      groupkey: PropTypes.string.isRequired
    }).isRequired,
    star: PropTypes.func.isRequired,
  };

  static defaultProps = {
    annotations: Immutable.Map(),
    norms: Immutable.List(),
  };

  componentWillMount() {
    const { fetch, params, norms } = this.props;
    norms.isEmpty() && fetch(params.groupkey);
  }

  render() {
    const { norms, star, annotations } = this.props;

    if (norms.isEmpty()) {
      return <div>Loading...</div>;
    }

    return <Law norms={norms} annotations={annotations} star={star} />;
  }
}


const mapStateToProps = (state, props) => {
  const { groupkey } = props.params;

  return {
    norms: getLaws(state).get(groupkey),
    annotations: Immutable.Map(getUserLaws(state).filter(law =>
      law.get('groupkey') === groupkey
    ).map(norm => [norm.get('enumeration'), norm]))
  };
};

const mapDispatchToProps = {
  fetch: fetchLaw,
  star,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawContainer);
