import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import {
  DataTable, TableHeader,
  IconToggle, Icon,
  FABButton,
} from 'react-mdl';

import Pagination from './Pagination';
import styles from './lawList.sss';


const LawList = ({ laws, page, pageSize, selectPage, star, stars, total }) => {
  const rows = laws.map((law, key) => law.merge({
    key,
    star: (
      <IconToggle ripple
        checked={!!stars[key]}
        name={stars[key] ? 'star' : 'star_border'}
        onChange={() => star(key, !stars[key])}
      />
    ),
    action: (
      <Link to={'/gesetz/' + key}>
        <FABButton mini>
          <Icon name='launch' />
        </FABButton>
      </Link>
    )
  })).toList().toJS();
  // ^ Conversion needed because react-mdl does not like immutable objects.

  return (
    <div>
      <DataTable
        rows={rows}
        className={styles.datatable}
      >
        <TableHeader name='star' />
        <TableHeader name='groupkey'>Ab&shy;kür&shy;zung</TableHeader>
        <TableHeader name='title'>Be&shy;zeich&shy;nung</TableHeader>
        <TableHeader name='action' />
      </DataTable>
      <Pagination
        page={page}
        hasNext={total > (pageSize*page)}
        hasPrev={page > 1}
        selectPage={selectPage}
      />
    </div>
  );
};

LawList.propTypes = {
  laws: ImmutablePropTypes.orderedMapOf(ImmutablePropTypes.mapContains({
    groupkey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  selectPage: PropTypes.func.isRequired,
  star: PropTypes.func.isRequired,
  stars: PropTypes.objectOf(PropTypes.bool).isRequired,
  total: PropTypes.number.isRequired,
};

LawList.defaultProps = {
  page: 1,
  pageSize: 20,
};


export default LawList;
