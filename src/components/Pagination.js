import React, { PropTypes } from 'react';
import { Button, Icon } from 'react-mdl';


const Pagination = ({ page, pages, selectPage }) => (
  <div style={{ textAlign: 'right', margin: '1em 0' }}>
    <Button disabled>Seite {page} von {pages}</Button>
    {page === 1 ? null :
      <Button onClick={() => selectPage(page - 1)} ripple>
        <Icon name='keyboard_arrow_left' />
      </Button>
    }
    {page === pages ? null :
      <Button onClick={() => selectPage(page + 1)} ripple>
        <Icon name='keyboard_arrow_right' />
      </Button>
    }
  </div>
);

Pagination.propTypes = {
  page: PropTypes.number,
  pages: PropTypes.number.isRequired,
  selectPage: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  hasNext: true,
  page: 1,
};


export default Pagination;
