import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';

const ActionButton = ({
  label,
  onClick,
  loading,
  disabled,
  color = 'primary',
  icon,
  ...buttonProps
}) => (
  <Button
    color={color}
    disabled={disabled || loading}
    onClick={onClick}
    endIcon={icon}
    {...buttonProps}>
    {loading && (
      <CircularProgress
        style={{ marginRight: '8px' }}
        size={20}
        thickness={6}
        color={color}
      />
    )}
    {label}
  </Button>
);

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  icon: PropTypes.element
};

export default ActionButton;
