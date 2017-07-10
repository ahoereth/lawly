import React, { PropTypes } from 'react';
import { FABButton, Button } from 'react-mdl';
import cn from 'classnames';

const IconButton = ({
  raised = false,
  icon,
  square = false,
  style = {},
  className = '',
  ...rest
}) => {
  const ico = React.createElement(icon, { style: { verticalAlign: 'sub' } });
  if (raised) {
    return (
      <FABButton
        ripple
        mini
        style={{
          width: 32,
          minWidth: 32,
          height: 32,
          minHeight: 32,
          ...style,
        }}
        {...rest}
      >
        {ico}
      </FABButton>
    );
  }

  return (
    <Button
      className={cn({ 'mdl-button--icon': !square }, className)}
      style={{ fontSize: '1.5em', lineHeight: '0.9em' }}
      ripple
      {...rest}
    >
      {ico}
    </Button>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  raised: PropTypes.bool,
  square: PropTypes.bool,
  icon: PropTypes.func.isRequired,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default IconButton;
