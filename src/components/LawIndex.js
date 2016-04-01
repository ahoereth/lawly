import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import LawInitialChooser from './LawInitialChooser';


const LawIndex = ({
  initials,
  laws,
  page,
  pageSize,
  selectInitial,
  selectPage,
  selectedInitial,
  star,
  stars,
  total,
}) => (
  <Grid>
    <Cell col={1} tablet={1} phone={4}>
      <LawInitialChooser
        initials={initials}
        selected={selectedInitial}
        onSelect={selectInitial}
      />
    </Cell>
    <Cell col={11} tablet={7} phone={4}>
      <p>
        In der Datenbank finden sich insgesamt <strong>{total} Gesetze und Verordnungen</strong> deren Kürzel mit dem <strong>Anfangsbuchstaben {selectedInitial.toUpperCase()}</strong> beginnt.
        Aktuell wird <strong>Seite {page} von {Math.ceil(total/pageSize)}</strong> angezeigt &ndash;&nbsp;
        <i onClick={() => selectPage(page*pageSize > total ? 1 : page+1)} className='action'>
          {page*pageSize > total ? 'erste' : 'nächste'} Seite
        </i>.
      </p>
      <LawList {...{laws, page, pageSize, total, selectPage, star, stars}} />
    </Cell>
  </Grid>
);

LawIndex.propTypes = {
  initials: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  laws: ImmutablePropTypes.orderedMap.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  selectInitial: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  selectedInitial: PropTypes.string.isRequired,
  star: PropTypes.func.isRequired,
  stars: ImmutablePropTypes.setOf(PropTypes.string).isRequired,
  total: PropTypes.number.isRequired,
};


export default LawIndex;
