/**
 *
 * Button
 *
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  button: {
    margin: 0,
    textTransform: 'none',
  },
  input: {
    display: 'none',
  },
}));

function ContainedButton(props) {
  const classes = useStyles();
  return (
    <Button
      color="primary"
      variant="contained"
      className={classes.button}
      {...props}
    >
      {props.children}
    </Button>
  );
}

ContainedButton.propTypes = {
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  children: PropTypes.any,
};

ContainedButton.defaultProps = {
  disabled: false,
  fullWidth: false,
  size: 'medium',
  variant: 'contained',
};

export default memo(ContainedButton);
