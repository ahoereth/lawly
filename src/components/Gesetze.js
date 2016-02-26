import React, { PropTypes } from 'react';
import { DataTable, FABButton, Icon } from 'react-mdl';


import './gesetze.css';


class Gesetze extends React.Component {
  static propTypes = {
    gesetze: PropTypes.array.isRequired,
    onChoice: PropTypes.func.isRequired
  };

  render() {
    const { gesetze, onChoice } = this.props;

    const columns = [
      { name: 'groupid', label: 'Abkürzung' },
      { name: 'titel', label: 'Bezeichnung' },
      { name: 'button' }
    ];

    const rows = gesetze.map((gesetz, idx) => {
      return Object.assign({}, gesetz, { button: (
        <FABButton mini onClick={() => onChoice(gesetz, idx)}>
          <Icon name='launch' />
        </FABButton>
      )});
    });

    return (
      <div className='gesetze-data-table'>
        <DataTable
          columns={columns}
          rows={rows}
        />
      </div>
    );
  }
}

export default Gesetze;
