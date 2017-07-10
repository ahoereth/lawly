import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'react-mdl';

import KeyboardArrowLeftIcon from 'react-icons/md/keyboard-arrow-left';
import KeyboardArrowRightIcon from 'react-icons/md/keyboard-arrow-right';

import IconButton from './IconButton';

const Pagination = ({ page, pages, selectPage, nextPageLink, prevPageLink }) =>
  <div style={{ textAlign: 'right', margin: '1em 0' }}>
    {!page ||
      !pages ||
      <Button disabled>
        Seite {page} von {pages}
      </Button>}
    {page === 1 // eslint-disable-line no-nested-ternary
      ? null
      : prevPageLink
        ? <Link to={prevPageLink}>
            <IconButton square icon={KeyboardArrowLeftIcon} />
          </Link>
        : !!selectPage &&
          <IconButton
            square
            icon={KeyboardArrowLeftIcon}
            onClick={() => selectPage(page - 1)}
          />}
    {page === pages // eslint-disable-line no-nested-ternary
      ? null
      : nextPageLink
        ? <Link to={nextPageLink}>
            <IconButton square icon={KeyboardArrowRightIcon} />
          </Link>
        : !!selectPage &&
          <IconButton
            square
            icon={KeyboardArrowRightIcon}
            onClick={() => selectPage(page + 1)}
          />}
  </div>;

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
