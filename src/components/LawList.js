import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DataTable, FABButton, Icon } from 'react-mdl';

import Pagination from './Pagination';
import './lawList.scss';


const LawList = ({ laws, page, pageSize, selectPage, total }) => {
  const columns = [
    { name: 'groupkey', label: <span>Ab&shy;kür&shy;zung</span> },
    { name: 'titel', label: <span>Be&shy;zeich&shy;nung</span> },
    { name: 'action' },
  ];

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
        columns={columns}
        rows={rows}
        className='law-list'
      />
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
  selectPage: PropTypes.func,
  total: PropTypes.number,
};

LawList.defaultProps = {
  page: 1,
  pageSize: 50,
};


export default LawList;
