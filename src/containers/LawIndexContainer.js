import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  getLawsByInitial,
  fetchLawIndex, selectLawIndexInitial,
} from 'redux/modules/laws';
import { LawIndex } from 'components';


class LawIndexContainer extends React.Component {
  static propTypes = {
    fetchLawIndex: PropTypes.func.isRequired,
    initials: PropTypes.array.isRequired,
    laws: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      initial: PropTypes.string,
    }).isRequired,
    selectLawIndexInitial: PropTypes.func.isRequired,
    selectedInitial: PropTypes.string,
  };

  componentWillMount() {
    const {
      fetchLawIndex,
      params,
      selectedInitial,
      selectLawIndexInitial,
    } = this.props;

    fetchLawIndex();
    selectedInitial || selectLawIndexInitial(params.initial);
  }

  render() {
    const {
      selectedInitial,
      initials,
      loading,
      selectLawIndexInitial,
      laws,
    } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <LawIndex
        laws={laws}
        initials={initials}
        changeGroup={selectLawIndexInitial}
        selectedInitial={selectedInitial}
      />
    );
  }
}


const mapStateToProps = (state) => {
  const { initials, selectedInitial, loading } = state.laws;

  return {
    laws: getLawsByInitial(state),
    loading: !!loading,
    selectedInitial,
    initials,
  };
};

const mapDispatchToProps = { fetchLawIndex, selectLawIndexInitial };


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
