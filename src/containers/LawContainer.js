import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { selectLaw, getNormHierarchy } from 'redux/modules/laws';
import { getUserLaws, star } from 'redux/modules/user';
import { Law } from 'components';


class LawContainer extends React.Component {
  static propTypes = {
    annotations: ImmutableTypes.map.isRequired,
    norms: ImmutableTypes.list.isRequired,
    params: PropTypes.shape({
      groupkey: PropTypes.string.isRequired
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
    norms: getNormHierarchy(state),
    annotations: Immutable.Map(getUserLaws(state).filter(law =>
      law.get('groupkey') === groupkey
    ).map(norm => [norm.get('enumeration'), norm]))
  };
};

const mapDispatchToProps = {
  selectLaw,
  star,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawContainer);
