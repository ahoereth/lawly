import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  getLawsByInitialAndPage,
  fetchLawIndex, selectLawIndexInitial, selectLawIndexPage,
} from 'redux/modules/laws';
import { LawIndex } from 'components';


class LawIndexContainer extends React.Component {
  static propTypes = {
    fetchIndex: PropTypes.func.isRequired,
    initials: PropTypes.array.isRequired,
    laws: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    params: PropTypes.shape({
      initial: PropTypes.string,
    }).isRequired,
    selectInitial: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    selectedInitial: PropTypes.string,
    total: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const {
      fetchIndex,
      params,
      selectInitial,
      selectPage,
      selectedInitial,
    } = this.props;

    console.log('mount', params);
    fetchIndex();
    selectedInitial || selectInitial(params.initial);
    params.page && selectPage(parseInt((params.page || 0), 10));
  }

  shouldComponentUpdate(nextProps) {
    if (typeof nextProps.params.page === 'undefined') {
      this.props.selectPage(1);
      return false;
    }
    return true;
  }

  render() {
    const {
      initials,
      laws,
      loading,
      page,
      pageSize,
      selectedInitial,
      selectInitial,
      selectPage,
      total,
    } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <LawIndex
        initials={initials}
        laws={laws}
        page={page}
        pageSize={pageSize}
        total={total}
        selectedInitial={selectedInitial}
        selectInitial={selectInitial}
        selectPage={selectPage}
      />
    );
  }
}


const mapStateToProps = (state) => {
  const {
    initials,
    indexPage,
    indexPageSize,
    loading,
    selectedInitial,
  } = state.laws;

  const { total, laws } = getLawsByInitialAndPage(state);
  return {
    initials,
    total,
    laws,
    loading: !!loading,
    page: indexPage,
    pageSize: indexPageSize,
    selectedInitial,
  };
};

const mapDispatchToProps = {
  fetchIndex: fetchLawIndex,
  selectInitial: selectLawIndexInitial,
  selectPage: selectLawIndexPage,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
