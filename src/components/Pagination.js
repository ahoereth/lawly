import React, { PropTypes } from 'react';
import { Button } from 'react-mdl';


const Pagination = ({ page, hasNext, hasPrev, selectPage }) => (
  <div style={{margin: '1em 0'}}>
    {!hasPrev || page <= 1 ? false :
      <Button
        raised colored
        onClick={() => selectPage(page-1)}
        style={{float: 'left'}}
      >
        Letzte Seite
      </Button>
    }
    {!hasNext ? false :
      <Button
        raised accent
        onClick={() => selectPage(page+1)}
        style={{float: 'right'}}
      >
        Nächste Seite
      </Button>
    }
  </div>
);

Pagination.propTypes = {
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool,
  page: PropTypes.number,
  selectPage: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  hasNext: true,
  hasPrev: true,
  page: 1,
};


export default Pagination;
