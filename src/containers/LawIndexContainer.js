import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import {
  getLawsByInitialAndPage, getInitial, getInitials, getPage, getPageSize,
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
    initials: PropTypes.instanceOf(Immutable.List).isRequired,
    laws: PropTypes.instanceOf(Immutable.OrderedMap).isRequired,
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

    laws.size > 0 || fetchIndex();
    selectInitial(params.initial || selectedInitial);
    selectPage(params.page ? parseInt(params.page, 10) : page);
  }

  render() {
    const {
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

    if (laws.size === 0) {
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


const mapStateToProps = (state) => ({
  ...getLawsByInitialAndPage(state), // total, laws
  initials: getInitials(state),
  page: getPage(state),
  pageSize: getPageSize(state),
  selectedInitial: getInitial(state),
  stars: getStars(state),
});

const mapDispatchToProps = {
  fetchIndex: fetchLawIndex,
  selectInitial: selectLawIndexInitial,
  selectPage: selectLawIndexPage,
  star: starLaw,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
