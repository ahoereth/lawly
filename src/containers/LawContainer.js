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
    // See github.com/yannickcr/eslint-plugin-react/issues/816
    params: PropTypes.shape({ /* eslint-disable react/no-unused-prop-types */
      groupkey: PropTypes.string,
      enumeration: PropTypes.string,
    }).isRequired, /* eslint-enable react/no-unused-prop-types */
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
    const { selectLaw, params, push, shell, setTitle } = this.props;
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
    const { annotations, norms, params, star } = this.props;
    return (
      <Law
        annotations={annotations}
        deeplink={params.enumeration}
        loading={loading}
        norms={norms}
        star={star}
      />
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LawContainer);
