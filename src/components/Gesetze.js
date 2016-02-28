import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DataTable, FABButton, Icon } from 'react-mdl';

import './gesetze.css';


const Gesetze = ({ gesetze }) => {
  const columns = [
    { name: 'groupkey', label: 'Abkürzung' },
    { name: 'titel', label: 'Bezeichnung' },
    { name: 'action' },
  ];

  const rows = gesetze.map((gesetz, idx) => {
    return {...gesetz,
      key: gesetz.groupkey,
      action: (
        <Link key={idx} to={'/gesetze/' + gesetz.groupkey}>
          <FABButton mini>
            <Icon name='launch' />
          </FABButton>
        </Link>
      )
    };
  });

  return (
    <div className='gesetze-data-table'>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

Gesetze.propTypes = {
  gesetze: PropTypes.array.isRequired,
};


export default Gesetze;
