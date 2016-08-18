import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Immutable from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { selectLaw, getNormHierarchy } from '~/modules/laws';
import { getSelectionAnnotations, star } from '~/modules/user';
import { Law } from '~/components';


const mapStateToProps = state => ({
  norms: getNormHierarchy(state),
  annotations: getSelectionAnnotations(state),
});


const mapDispatchToProps = {
  selectLaw,
  star,
};


class LawContainer extends React.Component {
  static propTypes = {
    annotations: ImmutableTypes.map.isRequired,
    norms: ImmutableTypes.list.isRequired,
    params: PropTypes.shape({
      groupkey: PropTypes.string.isRequired,
    }).isRequired,
    selectLaw: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired,
  };

  static defaultProps = {
    annotations: Immutable.Map(),
    norms: Immutable.List(),
  };

  componentWillMount() {
    const { selectLaw, params } = this.props;
    selectLaw(params.groupkey);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { norms, star, annotations } = this.props;

    if (norms.isEmpty()) {
      return <div>Loading...</div>;
    }

    return <Law norms={norms} annotations={annotations} star={star} />;
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LawContainer);
