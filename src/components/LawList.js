import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  DataTable, TableHeader,
  IconToggle, Icon,
  FABButton,
} from 'react-mdl';

import Pagination from './Pagination';
import styles from './lawList.sss';


const LawList = ({ laws, page, pageSize, selectPage, star, stars, total }) => {
  const rows = laws.map(law => ({...law,
    key: law.groupkey,
    star: (
      <IconToggle ripple
        checked={!!stars[law.groupkey]}
        name={stars[law.groupkey] ? 'star' : 'star_border'}
        onChange={() => star(law.groupkey, !stars[law.groupkey])}
      />
    ),
    action: (
      <Link to={'/gesetz/' + law.groupkey}>
        <FABButton mini>
          <Icon name='launch' />
        </FABButton>
      </Link>
    )
  }));

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
  laws: PropTypes.array.isRequired,
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
