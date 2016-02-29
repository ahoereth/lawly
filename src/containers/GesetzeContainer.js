import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  getLawsByInitial,
  fetchToc, selectTocInitial,
} from '../redux/modules/gesetze';
import { Gesetze } from '../components';


class GesetzeContainer extends React.Component {
  static propTypes = {
    fetchToc: PropTypes.func.isRequired,
    initials: PropTypes.array.isRequired,
    laws: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    selectTocInitial: PropTypes.func.isRequired,
    selectedInitial: PropTypes.string,
  };

  componentWillMount() {
    const { fetchToc, selectedInitial, selectTocInitial } = this.props;
    fetchToc();
    if (!selectedInitial) {
      selectTocInitial('A');
    }
  }

  render() {
    const {
      selectedInitial,
      initials,
      loading,
      selectTocInitial,
      laws,
    } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Gesetze
        gesetze={laws}
        initials={initials}
        changeGroup={selectTocInitial}
        selectedInitial={selectedInitial}
      />
    );
  }
}



const mapStateToProps = (state) => {
  const { initials, selectedInitial, loading } = state.gesetze;

  return {
    laws: getLawsByInitial(state),
    loading: !!loading,
    selectedInitial,
    initials,
  };
};

const mapDispatchToProps = { fetchToc, selectTocInitial };


export default connect(mapStateToProps, mapDispatchToProps)(GesetzeContainer);
