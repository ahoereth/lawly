import React, { PropTypes } from 'react';
import { List } from 'immutable';
import ImmutableTypes from 'react-immutable-proptypes';


const LawIndexLead = ({
  total,
  collection,
  // initial,
  // filters: { groupkey, title, starred },
  page,
  pageSize,
}) => (
  <p>
    {!collection.size ? null :
      <span>Die Gesetzsammlung <strong>{collection.get('title')}</strong> beinhaltet insgesamt {collection.get('laws', List()).size} Gesetze und Verordnungen.&nbsp;</span>
    }
    <span>
      Durch den aktuellen Filter werden {total} von diesen angezeigt. Du befindest dich aktuell auf <strong>Seite {page} von {Math.ceil(total/pageSize)}</strong>.
    </span>
  {/*<p>
    {total === 0
      ? <span>In der Datenbank findet sich insgesamt <strong>ein Gesetz oder eine Verordnung</strong>, welche/s mit dem aktuellen Filter übereinstimmt:&nbsp;</span>
      : <span>In der Datenbank finden sich insgesamt <strong>{total} Gesetze und Verodnungen</strong>, die mit dem aktuellen Filter übereinstimmen:&nbsp;</span>
    }
    Ihr Kürzel beginnt mit dem <strong>Anfangsbuchstaben {initial.toUpperCase()}</strong>
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
    Aktuell wird <strong>Seite {page} von {Math.ceil(total/pageSize)}</strong> angezeigt.
  </p>*/}
  </p>
);

LawIndexLead.propTypes = {
  collection: ImmutableTypes.mapContains({
    title: PropTypes.string,
    laws: ImmutableTypes.list,
  }).isRequired,
  filters: ImmutableTypes.map,
  initial: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};


export default LawIndexLead;
