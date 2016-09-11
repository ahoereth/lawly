import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { Map } from 'immutable';
import {
  TableHeader,
  IconButton, Icon, Tooltip,
  FABButton,
  Textfield,
} from 'react-mdl';

import { getNormLink } from '~/helpers';
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
  selectPage,
  star, stars,
  disableUnstarred,
}) => {
  const areAllStarred = !!stars
    ? laws.filter(law => stars.get(law.get('groupkey')) >= 0).size === laws.size
    : false;
  const starMany = laws => laws.forEach(law => star(law, !areAllStarred));

  const rows = laws.map(law => {
    const state = stars ? stars.get(law.get('groupkey'), -2) : null;
    const groupkey = law.get('groupkey');
    const enumeration = law.get('enumeration');
    return Map({
      title: law.get('title'), groupkey,
      key: `${groupkey}${enumeration}`,
      star: star && (
        <Tooltip
          label={
            /* eslint-disable no-nested-ternary */
            disableUnstarred && state === -2 ? 'Online gehen zum speichern' :
            state === -2 ? 'Tippen zum Speichern' :
            state === -1 ? 'Beinhaltet Lesezeichen, klicken zum Speichern' :
            state === 0 ? 'Tippen zum Löschen' :
                          'Beinhaltet Lesezeichen, tippen zum Löschen'
            /* eslint-enable no-nested-ternary */
          }
        >
          <IconButton
            disabled={disableUnstarred && state === -2}
            ripple
            colored={state >= 0}
            name={Math.abs(state) === 1 ? 'collections_bookmark' : 'book'}
            onClick={() => star(law, state < 0)}
          />
        </Tooltip>
      ),
      action: disableUnstarred && state === -2 ?
        <FABButton mini disabled><Icon name='launch' /></FABButton> : (
        <Link
          to={getNormLink(groupkey, enumeration)}
          style={{ color: 'inherit' }}
        >
          <FABButton mini><Icon name='launch' /></FABButton>
        </Link>
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
        {!!star &&
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
          // eslint-disable-next-line no-nested-ternary
          tooltip={!star || total > 50 ? '' :
            (!areAllStarred ? 'Alle speichern' : 'Alle löschen')
          }
        >
          {!star || total > 50 ? null :
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
  disableUnstarred: PropTypes.bool.isRequired,
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
};


LawList.defaultProps = {
  disableUnstarred: false,
  page: 1,
  pageSize: 20,
};


export default LawList;
