import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import {
  getFilteredLawsByPage, getInitial, getInitials, getPage, getPageSize,
  getFilters, getFilteredLawsCount,
  fetchLawIndex, selectLawIndexInitial, selectLawIndexPage, filterLawIndex,
} from 'redux/modules/law_index';
import {
  getIndexStars,
  star,
} from 'redux/modules/user';
import { LawIndex } from 'components';


class LawIndexContainer extends React.Component {
  static propTypes = {
    fetchIndex: PropTypes.func.isRequired,
    filter: PropTypes.func.isRequired,
    filters: ImmutableTypes.map,
    initials: ImmutableTypes.list.isRequired,
    laws: ImmutableTypes.list.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    params: PropTypes.shape({
      initial: PropTypes.string,
    }).isRequired,
    selectInitial: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    selectedInitial: PropTypes.string,
    star: PropTypes.func.isRequired,
    stars: ImmutableTypes.map.isRequired,
    total: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const {
      fetchIndex,
      page,
      params,
      total,
      selectInitial,
      selectPage,
      selectedInitial,
    } = this.props;

    total > 0 || fetchIndex();
    selectInitial(params.initial || selectedInitial);
    selectPage(params.page ? parseInt(params.page, 10) : page);
  }

  render() {
    const {
      filter,
      filters,
      initials,
      laws,
      page,
      pageSize,
      selectedInitial,
      selectInitial,
      selectPage,
      star,
      stars,
      total,
    } = this.props;

    return (
      <LawIndex {...{
        initials, laws, total,
        page, pageSize,
        selectedInitial, selectInitial, selectPage,
        star, stars,
        filter, filters,
      }} />
    );
  }
}


const mapStateToProps = (state) => ({
  total: getFilteredLawsCount(state),
  laws: getFilteredLawsByPage(state), // total, laws
  initials: getInitials(state),
  page: getPage(state),
  pageSize: getPageSize(state),
  selectedInitial: getInitial(state),
  stars: getIndexStars(state),
  filters: getFilters(state),
});

const mapDispatchToProps = {
  fetchIndex: fetchLawIndex,
  selectInitial: selectLawIndexInitial,
  selectPage: selectLawIndexPage,
  filter: filterLawIndex,
  star,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
