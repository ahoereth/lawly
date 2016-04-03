import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import {
  DataTable, TableHeader,
  IconButton, Icon,
  FABButton,
} from 'react-mdl';

import Pagination from './Pagination';
import styles from './lawList.sss';


const LawList = ({ laws, page, pageSize, selectPage, star, stars, total }) => {
  const rows = laws.map((title, groupkey) => ({
    title, groupkey,
    star: (
      <IconButton
        ripple
        colored={!!stars.get(groupkey)}
        name={stars.get(groupkey) ? 'star' : 'star_border'}
        onClick={() => star(groupkey, !stars.get(groupkey))}
      />
    ),
    action: (
      <Link to={'/gesetz/' + groupkey}>
        <FABButton mini>
          <Icon name='launch' />
        </FABButton>
      </Link>
    )
  })).toList().toJS();
  // ^ Conversion needed because react-mdl does not like immutable objects.

  return (
    <div>
      <DataTable rows={rows} className={styles.datatable}>
        <TableHeader name='star' />
        <TableHeader name='groupkey'>Ab&shy;kür&shy;zung</TableHeader>
        <TableHeader name='title'>Be&shy;zeich&shy;nung</TableHeader>
        <TableHeader name='action' />
      </DataTable>
      <Pagination
        page={page}
        pages={Math.ceil(total/pageSize)}
        selectPage={selectPage}
      />
    </div>
  );
};

LawList.propTypes = {
  laws: ImmutablePropTypes.orderedMapOf(PropTypes.string).isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  selectPage: PropTypes.func.isRequired,
  star: PropTypes.func.isRequired,
  stars: ImmutablePropTypes.setOf(PropTypes.string).isRequired,
  total: PropTypes.number.isRequired,
};

LawList.defaultProps = {
  page: 1,
  pageSize: 20,
};


export default LawList;
