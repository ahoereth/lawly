import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { fetchLaw, getLaws } from 'redux/modules/laws';
import { getStars, starLaw } from 'redux/modules/user';
import { Law } from 'components';


class LawContainer extends React.Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    norms: ImmutablePropTypes.list,
    params: PropTypes.shape({
      groupkey: PropTypes.string.isRequired
    }).isRequired,
    star: PropTypes.func.isRequired,
    starred: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { fetch, params, norms } = this.props;
    norms || fetch(params.groupkey);
  }

  render() {
    const { norms, starred, star } = this.props;

    if (!norms || norms.size === 0) {
      return <div>Loading...</div>;
    }

    return <Law norms={norms} starred={starred} star={star} />;
  }
}


const mapStateToProps = (state, props) => {
  const { groupkey } = props.params;
  return {
    norms: getLaws(state).get(groupkey),
    starred: !!getStars(state)[groupkey],
  };
};

const mapDispatchToProps = {
  fetch: fetchLaw,
  star: starLaw,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawContainer);
