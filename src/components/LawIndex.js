import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import LawInitialChooser from './LawInitialChooser';
import LawCollectionChooser from './LawCollectionChooser';


const LawIndex = ({
  collection,
  collections,
  filter,
  filters,
  initials,
  laws,
  page,
  pageSize,
  selectCollection,
  selectInitial,
  selectPage,
  selectedInitial,
  star,
  stars,
  total,
}) => {
  const { groupkey, title, starred } = filters.toJS();
  return (
    <Grid>
      <Cell col={12} table={8} phone={4}>
        <LawCollectionChooser
          collections={collections}
          selected={collection}
          onSelect={selectCollection}
        />
      </Cell>
      <Cell col={1} tablet={1} phone={4}>
        <LawInitialChooser
          initials={initials}
          selected={selectedInitial}
          onSelect={selectInitial}
        />
      </Cell>
      <Cell col={11} tablet={7} phone={4}>
        <p>
          {total === 0
            ? <span>In der Datenbank findet sich insgesamt <strong>ein Gesetz oder eine Verordnung</strong>, welche/s mit dem aktuellen Filter übereinstimmt:&nbsp;</span>
            : <span>In der Datenbank finden sich insgesamt <strong>{total} Gesetze und Verodnungen</strong>, die mit dem aktuellen Filter übereinstimmen:&nbsp;</span>
          }
          Ihr Kürzel beginnt mit dem <strong>Anfangsbuchstaben {selectedInitial.toUpperCase()}</strong>
          {groupkey
            ? title
              ? starred
                ? <span>&nbsp;und beinhaltet <strong>{groupkey}</strong>. Außerdem ist <strong>{title}</strong> Teil ihrer Beschreibung und sie wurden von dir <strong>markiert</strong></span>
                : <span>&nbsp;und beinhaltet <strong>{groupkey}</strong>. Außerdem ist <strong>{title}</strong> Teil ihrer Bezeichnung</span>
              : starred
                ? <span>, stimmt mit <strong>{groupkey}</strong> überein und sie wurden von dir <strong>markiert</strong></span>
                : <span>&nbsp;und stimmt mit <strong>{groupkey} </strong>überein</span>
            : title
              ? starred
                ? <span>wurden von dir <strong>markiert</strong> und ihre Bezeichnung beinhaltet <strong>{title}</strong>.</span>
                : <span>&nbsp;und ihre Bezeichnung beinhaltet <strong>{title}</strong></span>
              : !starred ? '' :
                <span>&nbsp;und wurden von dir <strong>markiert</strong></span>
          }.&nbsp;
          Aktuell wird <strong>Seite {page} von {Math.ceil(total/pageSize)}</strong> angezeigt &ndash;&nbsp;
          <i onClick={() => selectPage(page*pageSize > total ? 1 : page+1)} className='action'>
            {page*pageSize > total ? 'erste' : 'nächste'} Seite
          </i>.
        </p>
        <LawList
          laws={laws}
          page={page}
          pageSize={pageSize}
          total={total}
          selectPage={selectPage}
          star={star}
          stars={stars}
          filter={filter}
          filters={filters}
        />
      </Cell>
    </Grid>
  );
};

LawIndex.propTypes = {
  collection: PropTypes.string,
  collections: ImmutableTypes.listOf(PropTypes.string),
  filter: PropTypes.func,
  filters: ImmutableTypes.map,
  initials: ImmutableTypes.listOf(PropTypes.string).isRequired,
  laws: ImmutableTypes.list.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  selectCollection: PropTypes.func.isRequired,
  selectInitial: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  selectedInitial: PropTypes.string.isRequired,
  star: PropTypes.func.isRequired,
  stars: ImmutableTypes.map.isRequired,
  total: PropTypes.number.isRequired,
};


export default LawIndex;
