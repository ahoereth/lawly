import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';


const propTypes = {
  count: PropTypes.number.isRequired,
  collection: ImmutableTypes.mapContains({
    title: PropTypes.string,
    laws: ImmutableTypes.list,
  }).isRequired,
  filters: ImmutableTypes.map,
  initial: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};


/* eslint-disable max-len, no-nested-ternary */
const LawIndexLead = ({
  count,
  collection,
  initial: rawInitial,
  filters,
  page,
  pageSize,
}) => {
  const { groupkey, title, starred } = filters.toObject();
  const initial = rawInitial.toUpperCase();
  const filtered = groupkey || title || starred || initial;
  return (
    <p style={{ padding: '0 1em' }}>
      {(!filtered && !collection.has('title')
        ? <span>In der Datenbank finden sich insgesamt <strong>{count} Gesetze und Verodnungen</strong>. Nutze die Schalter und Eingabefelder um die angezeigte Auswahl zu filtern.</span>
        : (collection.has('title')
          ? (filtered
            ? <span>Aus der Sammlung <strong>{collection.get('title')}</strong> werden durch die aktuellen Filter <strong>{count} Gesetze und Verdnungen</strong> von insgesamt {collection.get('laws').size} angezeigt.&nbsp;</span>
            : <span>Die Sammlung <strong>{collection.get('title')}</strong> beinhaltet insgesamt {collection.get('laws').size} Gesetze und Verordnungen.</span>
          ) : <span>Durch den aktuellen Filter werden aktuell <strong>{count} Gesetze und Verodnungen</strong> angezeigt.&nbsp;</span>
        )
      )}
      {(initial
        ? (groupkey
          ? (title
            ? (starred
              ? <span>Sie wurden von dir <strong>markiert</strong>, verfügen über die <strong>Bezeichnung <em>{title}</em></strong> und die <strong>Kennung <em>{groupkey}</em></strong> mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
              : <span>Sie verfügen über die <strong>Bezeichnung <em>{title}</em></strong> und die <strong>Kennung <em>{groupkey}</em></strong> mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
            ) : (starred // no title
              ? <span>Sie wurden von dir <strong>markiert</strong> und verfügen über die <strong>Kennung <em>{groupkey}</em></strong> mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
              : <span>Sie verfügen über die <strong>Kennung <em>{groupkey}</em></strong> mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
            )
          ) : (title // no groupkey
            ? (starred
              ? <span>Sie wurden von dir <strong>markiert</strong>, sie beinhalten in ihrer <strong>Bezeichnung <em>{title}</em></strong> und ihr Kürzel beginnt mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong></span>
              : <span>Sie beinhalten in ihrer <strong>Bezeichnung <em>{title}</em></strong> und ihr Kürzel beginnt mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
            ) : (starred // no title
              ? <span>Sie wurden von dir <strong>markiert</strong> und ihr Kürzel beginnt mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
              : <span>Ihr Kürzel beginnt mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
            )
          )
        ) : (groupkey // no initial
          ? (title
            ? (starred
              ? <span>Sie wurden von dir <strong>markiert</strong>, verfügen über die <strong>Bezeichnung <em>{title}</em></strong> und die <strong>Kennung <em>{groupkey}</em></strong>.</span>
              : <span>Sie verfügen über die <strong>Bezeichnung <em>{title}</em></strong> und die <strong>Kennung <em>{groupkey}</em></strong>.</span>
            ) : (starred // no title
              ? <span>Sie wurden von dir <strong>markiert</strong> und verfügen über die <strong>Kennung <em>{groupkey}</em></strong>.</span>
              : <span>Sie verfügen über die <strong>Kennung <em>{groupkey}</em></strong>.</span>
            )
          ) : (title // no groupkey
            ? (starred
              ? <span>Sie wurden von dir <strong>markiert</strong> und beinhalten in ihrer <strong>Bezeichnung <em>{title}</em></strong>.</span>
              : <span>Sie beinhalten in ihrer <strong>Bezeichnung <em>{title}</em></strong>.</span>
            ) : (starred // no title
              ? <span>Sie wurden von dir <strong>markiert</strong>.</span>
              : null
            )
          )
        )
      )}
      <span>&nbsp;Aktuell wird <strong>Seite {page} von {Math.ceil(count / pageSize)}</strong> angezeigt.</span>
    </p>
  );
};

LawIndexLead.propTypes = propTypes;


export default LawIndexLead;
