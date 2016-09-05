import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';


const propTypes = {
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


/* eslint-disable max-len, no-nested-ternary */
const LawIndexLead = ({
  total,
  collection,
  initial: rawInitial,
  filters,
  page,
  pageSize,
}) => {
  const { groupkey, title, starred } = filters.toObject();
  const initial = rawInitial.toUpperCase();
  return (
    <p>
      {collection.has('title') ?
        <span>
          Die Gesetzsammlung <strong>{collection.get('title')}</strong> beinhaltet insgesamt {collection.get('laws').size} Gesetze und Verordnungen.
          {!initial && !groupkey && !title && !starred ? null :
            <span>Durch den aktuellen Filter werden {total} von diesen angezeigt.</span>
          }
        </span> :
        total < 2 ? null :
          <span>In der Datenbank finden sich insgesamt <strong>{total} Gesetze und Verodnungen</strong>, die mit dem aktuellen Filter übereinstimmen:&nbsp;</span>
      }
      {initial
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
            ) : (!starred ? '' : // no title
              <span>Sie wurden von dir <strong>markiert</strong> und ihr Kürzel beginnt mit dem <strong>Anfangsbuchstaben <em>{initial}</em></strong>.</span>
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
      }
      <span>Aktuell wird <strong>Seite {page} von {Math.ceil(total / pageSize)}</strong> angezeigt.</span>
    </p>
  );
};

LawIndexLead.propTypes = propTypes;


export default LawIndexLead;
