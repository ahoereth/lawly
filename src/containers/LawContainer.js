import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Immutable from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectLaw, getNormHierarchy } from '~/modules/laws';
import { getSelectionAnnotations, star } from '~/modules/user';
import { getShellMode, setTitle } from '~/modules/core';
import { Law } from '~/components';


const mapStateToProps = state => ({
  annotations: getSelectionAnnotations(state),
  norms: getNormHierarchy(state),
  shell: getShellMode(state),
});


const mapDispatchToProps = {
  push,
  selectLaw,
  setTitle,
  star,
};


class LawContainer extends React.Component {
  static propTypes = {
    annotations: ImmutableTypes.map.isRequired,
    norms: ImmutableTypes.list.isRequired,
    params: PropTypes.shape({
      groupkey: PropTypes.string,
    }).isRequired,
    push: PropTypes.func.isRequired,
    selectLaw: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    shell: PropTypes.bool.isRequired,
    star: PropTypes.func.isRequired,
  };

  static defaultProps = {
    annotations: Immutable.Map(),
    norms: Immutable.List(),
  };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentWillMount() {
    const { selectLaw, params, shell, setTitle } = this.props;
    setTitle(params.groupkey);

    if (!shell) {
      if (params.groupkey) {
        selectLaw(params.groupkey).then(() => {
          this.setState({ loading: false });
        });
      } else {
        push('/gesetze');
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { loading } = this.state;
    const { norms, star, annotations } = this.props;
    return (
      <Law
        annotations={annotations}
        loading={loading}
        norms={norms}
        star={star}
      />
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LawContainer);
