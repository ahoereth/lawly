import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  getLawsByInitialAndPage,
  fetchLawIndex, selectLawIndexInitial, selectLawIndexPage,
} from 'redux/modules/laws';
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
    page: PropTypes.number,
    pageSize: PropTypes.number,
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
      params,
      laws,
      selectInitial,
      selectPage,
      selectedInitial,
    } = this.props;

    laws.length > 0 || fetchIndex();
    selectedInitial || selectInitial(params.initial);
    params.page && selectPage(parseInt((params.page), 10));
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
    stars: getStars(state),
  };
};

const mapDispatchToProps = {
  fetchIndex: fetchLawIndex,
  selectInitial: selectLawIndexInitial,
  selectPage: selectLawIndexPage,
  star: starLaw,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
