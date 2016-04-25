import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import {
  DataTable, TableHeader,
  IconButton, Icon,
  FABButton,
  Textfield,
} from 'react-mdl';

import Pagination from './Pagination';
import styles from './lawList.sss';


const LawList = ({
  filter, filters,
  laws, total,
  page, pageSize, selectPage,
  star, stars,
}) => {
  total = total || laws.size;

  const rows = laws.map((title, groupkey) => ({
    title, groupkey,
    star: !star ? null : (
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
      <DataTable
        rows={rows}
        className={styles.datatable}
        rowKeyColumn='groupkey'
      >
        {!star ? null :
          <TableHeader name='star' numeric tooltip='Zeige nur gemerkte Normen'>
            {!filter || !filters ? null :
              <IconButton
                ripple
                name='stars'
                colored={filters.get('starred')}
                onClick={() => filter({ starred: !filters.get('starred') })}
              />
            }
          </TableHeader>
        }
        <TableHeader name='groupkey'>
          {!filter || !filters ? 'Ab&shy;kür&shy;zung' :
            <Textfield
              onChange={({ target }) => filter({ groupkey: target.value })}
              value={filters.get('groupkey', '')}
              label='Abkürzung'
            />
          }
        </TableHeader>
        <TableHeader name='title'>
          {!filter || !filters ? 'Be&shy;zeich&shy;nung' :
            <Textfield
              onChange={({ target }) => filter({ title: target.value })}
              value={filters.get('title', '')}
              label='Bezeichnung'
            />
          }
        </TableHeader>
        <TableHeader name='action' numeric />
      </DataTable>
      {!selectPage ? null :
        <Pagination
          page={page}
          pages={Math.ceil(total/pageSize)}
          selectPage={selectPage}
        />
      }
    </div>
  );
};

LawList.propTypes = {
  filter: PropTypes.func,
  filters: ImmutableTypes.map,
  laws: ImmutableTypes.orderedMapOf(PropTypes.string).isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  selectPage: PropTypes.func,
  star: PropTypes.func,
  stars: ImmutableTypes.setOf(PropTypes.string),
  total: PropTypes.number,
};

LawList.defaultProps = {
  page: 1,
  pageSize: 20,
};


export default LawList;
