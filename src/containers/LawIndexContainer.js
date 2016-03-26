import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  getLawsByInitialAndPage,
  fetchLawIndex, selectLawIndexInitial, selectLawIndexPage,
} from 'redux/modules/law_index';
import {
  getStars,
  starLaw,
} from 'redux/modules/user';
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
    star: PropTypes.func.isRequired,
    stars: PropTypes.objectOf(PropTypes.bool).isRequired,
    total: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const {
      fetchIndex,
      page,
      params,
      laws,
      selectInitial,
      selectPage,
      selectedInitial,
    } = this.props;

    laws.length > 0 || fetchIndex();
    selectInitial(params.initial || selectedInitial);
    selectPage(params.page ? parseInt(params.page, 10) : page);
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
      star,
      stars,
      total,
    } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <LawIndex {...{
        initials, laws, total,
        page, pageSize,
        selectedInitial, selectInitial, selectPage,
        star, stars
      }} />
    );
  }
}


const mapStateToProps = (state) => {
  const {
    initials,
    page,
    pageSize,
    initial,
  } = state.law_index;

  const { total, laws } = getLawsByInitialAndPage(state);
  return {
    initials,
    total,
    laws,
    page,
    pageSize,
    selectedInitial: initial,
    stars: getStars(state),
    loading: initials.length === 0,
  };
};

const mapDispatchToProps = {
  fetchIndex: fetchLawIndex,
  selectInitial: selectLawIndexInitial,
  selectPage: selectLawIndexPage,
  star: starLaw,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
