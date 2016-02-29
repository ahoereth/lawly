import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DataTable, FABButton, Icon } from 'react-mdl';

import './lawList.scss';


const LawList = ({ laws }) => {
  const columns = [
    { name: 'groupkey', label: 'Abkürzung' },
    { name: 'titel', label: 'Bezeichnung' },
    { name: 'action' },
  ];

  const rows = laws.map(law => ({...law,
    key: law.groupkey,
    action: (
      <Link to={'/gesetze/' + law.groupkey}>
        <FABButton mini>
          <Icon name='launch' />
        </FABButton>
      </Link>
    )
  }));

  return (
    <DataTable
      columns={columns}
      rows={rows}
      className='law-list'
    />
  );
};

LawList.propTypes = {
  laws: PropTypes.array.isRequired,
};


export default LawList;
