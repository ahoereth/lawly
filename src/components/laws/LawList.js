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
  emptysetMessage,
  filter, filters,
  laws, loading,
  total = laws.size,
  page, pageSize,
  selectPage,
  star, stars,
  disableUnstarred,
  ...otherProps,
}) => {
  const rows = laws.map(law => {
    const state = stars ? stars.get(law.get('groupkey'), -2) : null;
    const groupkey = law.get('groupkey');
    const title = law.get('title');
    const enumeration = law.get('enumeration');
    return Map({
      key: `${groupkey}${enumeration}`,
      groupkey: disableUnstarred && state === -2 ? groupkey : (
        <Link to={getNormLink(groupkey, enumeration)}>
          {groupkey}
        </Link>
      ),
      title: disableUnstarred && state === -2 ? title : (
        <Link to={getNormLink(groupkey, enumeration)}>
          {title}
        </Link>
      ),
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
    });
  });

  return (
    <div {...otherProps}>
      <DataTable
        loading={loading}
        className={styles.datatable}
        keyProp='key'
        rows={rows}
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
      </DataTable>
      {!rows.size &&
        <p style={{ textAlign: 'center' }}>{emptysetMessage}</p>
      }
      {!selectPage || !rows.size ||
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
  emptysetMessage: PropTypes.string.isRequired,
  disableUnstarred: PropTypes.bool.isRequired,
  filter: PropTypes.func,
  filters: ImmutableTypes.map,
  laws: ImmutableTypes.listOf(ImmutableTypes.mapContains({
    groupkey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  loading: PropTypes.bool,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  selectPage: PropTypes.func,
  star: PropTypes.func,
  stars: ImmutableTypes.mapOf(PropTypes.number),
  total: PropTypes.number,
};


LawList.defaultProps = {
  emptysetMessage: 'Für den aktuellen Filter wurden keine Gesetze gefunden.',
  disableUnstarred: false,
  page: 1,
  pageSize: 20,
};


export default LawList;
