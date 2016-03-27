import React, { PropTypes } from 'react';
import { Button, Icon } from 'react-mdl';


const iconAdjust = { marginBottom: '3px' };

const Pagination = ({ page, pages, selectPage }) => (
  <div style={{margin: '1em 0', position: 'relative'}}>
    <div style={{width: '100%', position: 'absolute'}}>
      <div style={{float: 'left'}}>
        {page < 3 ? null :
          <Button
            raised colored
            onClick={() => selectPage(1)}
            style={{margin: '0 1em 0 0'}}
          >
            <Icon name='skip_previous' style={iconAdjust} />
            Anfang
          </Button>
        }
        {page === 1 ? null :
          <Button
            raised colored
            onClick={() => selectPage(page-1)}
          >
            <Icon name='fast_rewind' style={iconAdjust} />
            Zurück
          </Button>
        }
      </div>
      <div style={{float: 'right'}}>
        {page === pages ? null :
          <Button
            raised accent
            onClick={() => selectPage(page+1)}
            style={{margin: '0 1em 0 0'}}
          >
            Weiter
            <Icon name='fast_forward' style={iconAdjust} />
          </Button>
        }
        {page >= (pages-1) ? null :
          <Button
            raised colored
            onClick={() => selectPage(pages)}
          >
            Ende
            <Icon name='skip_next' style={iconAdjust} />
          </Button>
        }
      </div>
    </div>
    <div style={{textAlign: 'center'}}>
      <Button disabled>Seite {page} von {pages}</Button>
    </div>
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
