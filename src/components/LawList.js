import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DataTable, TableHeader, FABButton, Icon } from 'react-mdl';

import Pagination from './Pagination';
import './lawList.scss';


const LawList = ({ laws, page, pageSize, selectPage, total }) => {
  const rows = laws.map(law => ({...law,
    key: law.groupkey,
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
        className='law-list'
      >
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
  total: PropTypes.number.isRequired,
};

LawList.defaultProps = {
  page: 1,
  pageSize: 20,
};


export default LawList;
