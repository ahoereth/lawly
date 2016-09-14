import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Icon } from 'react-mdl';


const Pagination = ({
  page,
  pages,
  selectPage,
  nextPageLink,
  prevPageLink,
}) => (
  <div style={{ textAlign: 'right', margin: '1em 0' }}>
    {!page || !pages || <Button disabled>Seite {page} von {pages}</Button>}
    {page === 1 ? null : (prevPageLink ? ( // eslint-disable-line
      <Link to={prevPageLink}>
        <Button ripple>
          <Icon name='keyboard_arrow_left' />
        </Button>
      </Link>
    ) : (!!selectPage &&
      <Button onClick={() => selectPage(page - 1)} ripple>
        <Icon name='keyboard_arrow_left' />
      </Button>
    ))}
    {page === pages ? null : (nextPageLink ? ( // eslint-disable-line
      <Link to={nextPageLink}>
        <Button ripple>
          <Icon name='keyboard_arrow_right' />
        </Button>
      </Link>
    ) : (!!selectPage &&
      <Button onClick={() => selectPage(page + 1)} ripple>
        <Icon name='keyboard_arrow_right' />
      </Button>
    ))}
  </div>
);

Pagination.propTypes = {
  nextPageLink: PropTypes.string,
  page: PropTypes.number,
  pages: PropTypes.number.isRequired,
  prevPageLink: PropTypes.string,
  selectPage: PropTypes.func, // TODO: deprecated
};

Pagination.defaultProps = {
  hasNext: true,
  page: 1,
};


export default Pagination;
