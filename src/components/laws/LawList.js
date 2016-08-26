import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import {
  TableHeader,
  IconButton, Icon, Tooltip,
  FABButton,
  Textfield,
} from 'react-mdl';

import { Pagination, DataTable } from '~/components';
import styles from './lawList.sss';



const shell = Map({
  star: <IconButton disabled name='book' />,
  action: <FABButton mini disabled><Icon name='launch' /></FABButton>,
  title: { type: 'shell', lines: [1, 2] },
});


const LawList = ({
  filter, filters,
  laws, total = laws.size,
  page, pageSize,
  selectPage, viewLaw,
  star, stars,
}) => {
  const areAllStarred = !!stars
    ? laws.filter(law => stars.get(law.get('groupkey')) >= 0).size === laws.size
    : false;
  const starMany = laws => laws.forEach(law => star(law, !areAllStarred));

  const rows = laws.map(law => {
    const state = stars ? stars.get(law.get('groupkey'), -2) : null;
    /* eslint-disable no-nested-ternary */
    return Map({
      title: law.get('title'),
      groupkey: law.get('groupkey'),
      key: `${law.get('groupkey')}${law.get('enumeration')}`,
      star: !star ? null : (
        <Tooltip
          label={
            state === -2
              ? 'Tippen zum Speichern'
              : state === -1
                ? 'Beinhaltet markierte Normen, klicken zum Speichern'
                : state === 0
                  ? 'Tippen zum Löschen'
                  : // state === 1
                    'Beinhaltet markierte Normen, tippen zum Löschen'
          }
        >
          <IconButton
            ripple
            colored={state >= 0}
            name={Math.abs(state) === 1 ? 'collections_bookmark' : 'book'}
            onClick={() => star(law, state < 0)}
          />
        </Tooltip>
      ),
      action: (
        <FABButton mini onClick={() => viewLaw(law)}>
          <Icon name='launch' />
        </FABButton>
      ),
    });
  });

  return (
    <div>
      <DataTable
        rows={rows}
        className={styles.datatable}
        keyProp='key'
        shell={shell}
      >
        {!star ? null :
          <TableHeader
            name='star' numeric
            tooltip={!filter ? undefined : 'Nur gespeicherte Normen zeigen'}
          >
            {!filter ? <span /> :
              <IconButton
                ripple
                name='stars'
                colored={filters.get('starred')}
                onClick={() => filter({ starred: !filters.get('starred') })}
              />
            }
          </TableHeader>
        }
        <TableHeader
          name='groupkey'
          tooltip={!filter ? undefined : 'Nach Abkürzung filtern'}
        >
          {!filter || !filters ? 'Abkürzung' :
            <Textfield
              onChange={({ target }) => filter({ groupkey: target.value })}
              value={filters.get('groupkey', '')}
              label='Abkürzung'
              floatingLabel
            />
          }
        </TableHeader>
        <TableHeader
          name='title'
          tooltip={!filter ? undefined : 'Nach Bezeichnung filtern'}
        >
          {!filter || !filters ? 'Bezeichnung' :
            <Textfield
              onChange={({ target }) => filter({ title: target.value })}
              value={filters.get('title', '')}
              label='Bezeichnung'
              floatingLabel
            />
          }
        </TableHeader>
        <TableHeader
          name='action' numeric
          tooltip={total <= 50
            ? (!areAllStarred ? 'Alle speichern' : 'Alle löschen')
            : ''
          }
        >
          {total > 50 ? null :
            <FABButton
              mini ripple
              colored={areAllStarred}
              onClick={() => starMany(laws)}
            >
              <Icon name='save' />
            </FABButton>
          }
        </TableHeader>
      </DataTable>
      {!selectPage ? null :
        <Pagination
          page={page}
          pages={Math.ceil(total / pageSize)}
          selectPage={selectPage}
        />
      }
    </div>
  );
};

LawList.propTypes = {
  filter: PropTypes.func,
  filters: ImmutableTypes.map,
  laws: ImmutableTypes.listOf(ImmutableTypes.mapContains({
    groupkey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  selectPage: PropTypes.func,
  star: PropTypes.func,
  stars: ImmutableTypes.mapOf(PropTypes.number),
  total: PropTypes.number,
  viewLaw: PropTypes.func.isRequired,
};

LawList.defaultProps = {
  page: 1,
  pageSize: 20,
};


export default LawList;
